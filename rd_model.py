from mesa import Agent, Model
from random import randint, choices, seed
from mesa.space import MultiGrid
from mesa.datacollection import DataCollector
from mesa.time import RandomActivation


class Palestinian(Agent):
    """
    Palestinians actors
    """
    def __init__(self, unique_id, model, discontent, add_violence_aftermath,\
                crowding_threshold):
        super().__init__(unique_id, model)
        self.unique_id = unique_id
        # civilians on a spectrum from unhappy willing to be 
        # violent (-100 - -50), unhappy and supportive of violence
        # though not actually violent (-49 - 0), neutral (0-50),
        # to actively working against violence (51-100)
        self.satisfaction = randint(-100,100)
        self.model = model
        self.discontent = discontent
        self.status = self.assign_status()
        self.add_violence_aftermath = add_violence_aftermath
        self.crowding_threshold = crowding_threshold

    def assign_status(self):
        if self.discontent == 'high':
            low, mid, up = (0, 30, 60)
        elif self.discontent == 'mid':
            low, mid, up = (-50, 0, 50)
        elif self.discontent == 'low':
            low, mid, up = (-60, -30, 20)

        if self.satisfaction <= low:
            return 'combatant'
        elif self.satisfaction < mid:
            return 'sympathetic'
        elif self.satisfaction <= up:
            return 'neutral'
        else:
            return 'anti-violence'

    def consider_violence(self, model):
        """
        If an agent is a combatant, commit a violent act
        with small probability
        """

        prob_violence = model.prob_violence

        violence = choices([True, False], weights=\
            [prob_violence, (1 - prob_violence)], k=1)
        if violence:
            # if a terrorist act is committed, its 
            # aftermath is felt for x rounds
            model.violence_aftermath = self.add_violence_aftermath
            model.num_attacks += 1
            # 60% die after attacks
            death= choices([True, False], weights=\
                [0.6, 0.4], k=1)  
            if death:
                model.deaths.append(self)

        return violence

    def react(self,model):
        """
        React to any actions / external surroundings
        """

        govt_action = model.govt_action
        action_pos = model.action_pos

        # decrease satisfaction due to overcrowded conditions
        crowding = len(self.model.grid.get_cell_list_contents([self.pos]))
        if crowding > self.crowding_threshold:
            self.satisfaction -= 5
        # otherwise, decrease satisfaction due to general living conditions
        else:
            self.satisfaction -= 1

        if model.violence_aftermath > 0:
            # should we have lower and upper bounds on sympathy/satisfaction?
            if self.status != 'combatant':
                self.satisfaction += 3

        if govt_action == 'INDISC-CONC':
            if model.sust_conc == 0:
                mult_conc = 1
            else:
                mult_conc = model.sust_conc

            self.satisfaction += 3 ** mult_conc
        
        if govt_action == 'TARG-CONC':
            if action_pos == self.pos:
                self.satisfaction += 2

        if govt_action == 'INDISC-REPR':
            if model.sust_repr == 0:
                mult_repr = 1.5
            else:
                mult_repr = model.sust_repr
            self.satisfaction -= 3 ** mult_repr

        if govt_action == 'TARG-REPR':
            # only have negative response to targeted repression if 
            # actively combatant or sympathetic
            if self.satisfaction < 0:
                self.satisfaction -= 3

    def step(self):
        """
        Respond to either terrorist attacks or Israeli actions
        """
        
        if self.status == 'combatant':
            violence = self.consider_violence(self.model)
        else:
            violence = False
        
        self.react(self.model)

        self.status = self.assign_status()


class IsraeliGovt(Agent):
    """
    Israeli government
    Inputs:
        policy: either conciliatory or repressive
    """
    def __init__(self, unique_id, model, policy, reactive_lvl):
        super().__init__(unique_id, model)
        self.policy = policy
        # govt reactive_lvl determines how long after an attack
        # govt responds with greater repressive force
        self.reactive_lvl = reactive_lvl
        self.status = 'NONE'
        self.model = model

    # government occasionally chooses to act, 
    # unless directly after terror attack, in which case
    # acts more regularly and with greater repression
    def act(self, model):  
        if self.reactive_lvl == 'high':
            upper_limit = 5
            lower_limit = 0
        elif self.reactive_lvl == 'mid-high':
            upper_limit = 7
            lower_limit = 2
        elif self.reactive_lvl == 'mid-low':
            upper_limit = 9
            lower_limit = 5
        elif self.reactive_lvl == 'low':
            upper_limit = model.violence_aftermath
            lower_limit = 8
        elif self.reactive_lvl == 'none':
            upper_limit = model.violence_aftermath
            lower_limit = model.violence_aftermath

        if model.violence_aftermath > upper_limit:
            weights = [0.1, 0.05, 0.05, 0.4, 0.4]
        elif model.violence_aftermath > lower_limit:
            weights = [0.2, 0.1, 0.1, 0.3, 0.3]
        elif self.policy == 'CONC':
            weights = [0.6, 0.2, 0.2, 0.05, 0.05]
        elif self.policy == 'REPR':
            weights = [0.6, 0.05, 0.05, 0.2, 0.2]
        else:
            weights = [0.6, 0.1, 0.1, 0.1, 0.1]
        self.status = choices(['NONE', 'INDISC-CONC','TARG-CONC',\
            'INDISC-REPR', 'TARG-REPR'], weights=weights, k=1)[0]

        model.govt_action = self.status

        if self.status in ['TARG-CONC', 'TARG-REPR']:
            x = model.random.randrange(model.grid.width)
            y = model.random.randrange(model.grid.height)
            model.action_pos = (x, y)
        else:
            model.action_pos = (0,0)

        # if perform conciliatory or repressive action,
        # add to a cumulative total which identifies sustained actions
        if self.status in ['TARG-CONC','INDISC-CONC']:
            model.sust_conc += 1
            model.sust_repr = 0
        
        elif self.status in ['TARG-REPR','INDISC-REPR']:
            model.sust_repr += 1
            model.sust_conc = 0

        else:
            model.sust_repr = 0
            model.sust_conc = 0

    def step(self):
        self.act(self.model)


class CounterterrorismModel(Model):
    """
    Model to manage the agents and actions involved
    """
    def __init__(self, N, height, width, prob_violence=0.005, \
                    reactive_lvl = 'mid-low',policy='NONE',\
                    discontent='mid', add_violence_aftermath=10, \
                    crowding_threshold=30, agent_birth_rate=0.03, 
                    timestep_to_change=None, change_prob_violence=0.005, \
                    change_reactive_lvl = 'mid-low',change_policy='NONE',\
                    change_discontent='mid', change_add_violence_aftermath=10, \
                    change_crowding_threshold=30, change_agent_birth_rate=0.03,
                    seed=50):
        self.num_agents = N
        self.height = height
        self.width = width
        self.prob_violence = prob_violence
        self.policy = policy
        self.reactive_lvl = reactive_lvl
        self.discontent = discontent
        self.crowding_threshold = crowding_threshold
        self.current_id = 0
        self.timestep = 1
        self.timestep_to_change = timestep_to_change
        self.grid = MultiGrid(height, width, torus=False)
        self.schedule = RandomActivation(self)
        self.sust_conc = 0
        self.sust_repr = 0
        self.num_attacks = 0
        self.violence_aftermath = 0
        # additional violence aftermath score to add after attack
        self.add_violence_aftermath = add_violence_aftermath
        self.deaths = []
        self.govt_action = 'NONE'
        self.action_pos = (0,0)
        self.agent_birth_rate = agent_birth_rate
        self.change_prob_violence=change_prob_violence, 
        self.change_reactive_lvl = change_reactive_lvl,
        self.change_policy=change_policy,
        self.change_discontent=change_discontent, 
        self.change_add_violence_aftermath=change_add_violence_aftermath, 
        self.change_crowding_threshold=change_crowding_threshold, 
        self.change_agent_birth_rate=change_agent_birth_rate

        seed = 50

        # create our Palestinian agents
        for i in range(self.num_agents):
            a = Palestinian(self.next_id(), self, self.discontent, \
                self.add_violence_aftermath, self.crowding_threshold)
            self.schedule.add(a)

            # add agent to random grid cell (neighborhoods)
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            self.grid.place_agent(a, (x, y))

        g = IsraeliGovt(self.next_id(), self, self.policy, self.reactive_lvl)
        self.schedule.add(g)
        # government always goes in 0,0 - we'll call this Jerusalem
        # so some Palestinians can live there as well
        self.grid.place_agent(g,(0,0))

        self.datacollector = DataCollector(
                model_reporters = {'num_agents':"num_agents",
                'num_attacks':'num_attacks'},
                agent_reporters = {'status':'status','agent_loc':'pos'},
                tables={'Deaths': ['step','deaths'],
                        'govt_actions':['step','govt_action','action_loc',\
                            'violence_aftermath']}
        )
        self.running = True

    def step(self):
        """
        Advance the model by one step.
        """
        seed = 50

        if self.timestep_to_change:
            if self.timestep == self.timestep_to_change:
                print('Regime change! Policy shift underway... \n')
                self.prob_violence = self.change_prob_violence
                self.policy = self.change_policy
                self.reactive_lvl = self.change_reactive_lvl
                self.discontent = self.change_discontent
                self.crowding_threshold = self.change_crowding_threshold
                self.add_violence_aftermath = self.change_add_violence_aftermath
                self.agent_birth_rate = self.change_agent_birth_rate

        self.schedule.step()
        # collect data
        self.datacollector.collect(self)
        self.datacollector.add_table_row('Deaths', {'step':self.timestep,\
            'deaths':len(self.deaths)})
        #print({'step':self.timestep,\
        #                    'govt_action':self.govt_action,\
        #                    'action_loc':self.action_pos,\
        #                    'violence_aftermath':self.violence_aftermath})
        self.datacollector.add_table_row("govt_actions", {'step':self.timestep,\
                            'govt_action':self.govt_action,\
                            'action_loc':self.action_pos,\
                            'violence_aftermath':self.violence_aftermath})

        # remove dead agents from model
        for x in self.deaths:
            if x:
                self.grid.remove_agent(x)
                self.schedule.remove(x)
                if self.num_agents > 0:
                  self.num_agents -= 1
        self.deaths = []

        # add to population
        new_births = randint(0,round(self.num_agents * self.agent_birth_rate))
        for i in range(new_births):
            a = Palestinian(self.next_id(), self, self.discontent, \
                self.add_violence_aftermath, self.crowding_threshold)
            self.schedule.add(a)

            # add agent to random grid cell (neighborhoods)
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            self.grid.place_agent(a, (x, y))
            self.num_agents += 1
        
        if self.violence_aftermath > 0:
            self.violence_aftermath -= 1
        
        self.timestep += 1