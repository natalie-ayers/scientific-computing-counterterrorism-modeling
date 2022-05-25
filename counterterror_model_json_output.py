import model
import pandas as pd
import numpy as np
import argparse
import sys
import ast
import json
import requests

def counterterror_model_http(request,verbose=True):
    """
    HTTP Cloud Function
    Args:
        request (dict): request object in dictionary form providing parameters for model
    Returns:
        return_vals (dict): dictionary of arrays and matrices with model results formatted
            for use in the react dashboard Counterterrorism Model
    """


    request_json = request

    grid_size = {200:(2,3),300:(3,3),400:(3,4),500:(4,4),600:(4,5),\
                800:(5,5)}
    h, w = grid_size[request_json['starting_pop']]

    scenario = model.CounterterrorismModel(N=request_json['starting_pop'], \
            height=h,width=w,prob_violence=request_json['violence_prob'],\
            policy=request_json['gov_policy'].upper(),reactive_lvl=\
            request_json['reactive_level'].lower(),\
            discontent=request_json['discontent'].lower(),add_violence_aftermath=\
            request_json['add_violence_aftermath'],crowding_threshold=request_json['crowding_threshold'],\
            agent_birth_rate=request_json['agent_birth_rate'])
    for i in range(request_json['total_steps']):
        scenario.step()

    # create arrays to send to dashboard
    max_y_govtactions = []
    hMap_act_x = []
    hMap_act_y = []
    hMap_act_size = []
    hMap_act_symbol = []
    step = list(range(1,request_json['total_steps']+1))
    hMap_sympathy = []
    hMap_num_combats = []

    pChart_classes = []

    # ----- Create dominant sentiment and num_combatants grids --- #
    agents_df = scenario.datacollector.get_agent_vars_dataframe()
    agents_df = agents_df.reset_index()
    agents_nogov_df = agents_df[agents_df.status.isin(['anti-violence',\
        'combatant','neutral','sympathetic'])]
    agents_nogov_df['step_cat'] = agents_nogov_df.Step.astype('str')
    
    # create df of num agents of each status per step
    agent_stati_gb = agents_nogov_df.groupby(by=['step_cat','status'])
    agent_stati = agent_stati_gb['AgentID'].nunique().reset_index()
    agent_stati = agent_stati.rename(columns={'AgentID':'num_agents'})
    agent_stati['step'] = agent_stati.step_cat.astype('int')

    # create df of dominant sentiment per cell per step
    agent_sents_gb = agents_nogov_df.groupby(by=['step_cat','agent_loc','status'])
    sentiments_cnt = agent_sents_gb['AgentID'].nunique().reset_index()
    sentiments_cnt = sentiments_cnt.rename(columns={'AgentID':'num_agents'})
    max_sentiments_gb = sentiments_cnt.groupby(by=['step_cat','agent_loc'])
    max_sentiments = max_sentiments_gb['num_agents'].max().reset_index()
    #print('max sent shape',max_sentiments.shape)
    max_sentiments = max_sentiments.merge(sentiments_cnt, on=['step_cat','agent_loc','num_agents'])
    # randomly decide which to keep for now; ideally drop according to hierarchy in future iteration
    max_sents_nodups = max_sentiments.drop_duplicates(subset=['step_cat','agent_loc','num_agents'])
    max_sents_nodups['step'] = max_sents_nodups.step_cat.astype('int')
    sentiments_cnt['step'] = sentiments_cnt.step_cat.astype('int')

   # ----- Create govt action arrays ----- #
    govt_actions = scenario.datacollector.get_table_dataframe('govt_actions')
    max_num_govt_actions = 0   
    full_ys = ['A','B','C','D','E','F']
    scen_ys = full_ys[:scenario.grid.width]
    full_xs = ["ㅤ1", "ㅤ2", "ㅤ3","ㅤ4", "ㅤ5", "ㅤ6"]        
    scen_xs = full_xs[:scenario.grid.height]     

    for mod_step in range(1,request_json['total_steps']+1):
        if verbose:
            print('mod step',mod_step)
        agent_step_df = agent_stati[agent_stati.step == mod_step]

        # update pChart classes for each step
        pChart_classes_step = [0,0,0,0]
        stati_map = {'anti-violence':0.0,'neutral':0.25,
                'sympathetic':0.50,'combatant':0.75}
        stati = ['anti-violence','neutral','sympathetic','combatant']
        for idx, stati_cnt in enumerate(stati):
            # if agents of status exist, set to number, else assign 0
            if stati_cnt in list(agent_step_df.status):
                pChart_classes_step[idx] = agent_step_df[agent_step_df.status==stati_cnt].\
                    num_agents.item()
        
        #print('pChart classes to add',pChart_classes_step)
        pChart_classes.append(pChart_classes_step)

        # update dominant sentiments and num combatants per step
        max_sent_step_df = max_sents_nodups[max_sents_nodups.step == mod_step]
        hmap_sentiments = np.zeros((scenario.grid.width, scenario.grid.height))
        hmap_num_combatants = np.zeros((scenario.grid.width, scenario.grid.height))
        for hmap_loc in max_sent_step_df.agent_loc:
            hmap_sentiments[hmap_loc] = stati_map[max_sent_step_df[max_sent_step_df.agent_loc==\
                                        hmap_loc].status.item()]

            
            test_comb_df = sentiments_cnt[(sentiments_cnt.step == mod_step) & \
                        (sentiments_cnt.agent_loc == hmap_loc)]
            if 'combatant' in list(test_comb_df.status):
                hmap_num_combatants[hmap_loc] = test_comb_df[test_comb_df.status == \
                                    'combatant'].num_agents.item()
            else:
                hmap_num_combatants[hmap_loc] = 0
        
        #print('hMap sympathy to append',hmap_sentiments)
        hMap_sympathy.append(hmap_sentiments.tolist())

        #print('hMap num combatants to append',hmap_num_combatants)
        hMap_num_combats.append(hmap_num_combatants.tolist())


        # update gov't action per step
        hmap_x = []
        hmap_y = []
        hmap_size = []
        hmap_symbol = []
        govt_action_df = govt_actions[govt_actions.step == mod_step]
        this_step_action = govt_action_df.govt_action.item()
        #print('this step action',this_step_action)
        if this_step_action in ['INDISC-CONC','INDISC-REPR']:
            max_num_govt_actions += 1
            hmap_y_long = [[y] * scenario.grid.height for y in scen_ys]
            hmap_y = [val for sublist in hmap_y_long for val in sublist]
            hmap_x = scen_xs * scenario.grid.width
            hmap_size = [80] * scenario.grid.width * scenario.grid.height
            if this_step_action == 'INDISC-CONC':
                hmap_symbol = [105] * scenario.grid.width * scenario.grid.height
            elif this_step_action == 'INDISC-REPR':
                hmap_symbol = [106] * scenario.grid.width * scenario.grid.height

        elif this_step_action in ['TARG-CONC','TARG-REPR']:
            max_num_govt_actions += 1
            y, x = govt_action_df.action_loc.item()
            hmap_x = [scen_xs[x]]
            hmap_y = [scen_ys[y]]
            hmap_size = [50]
            if this_step_action == 'TARG-CONC':
                hmap_symbol = [105]
            elif this_step_action == 'TARG-REPR':
                hmap_symbol = [106]

        max_y_govtactions.append(max_num_govt_actions)
        hMap_act_x.append(hmap_x)
        hMap_act_y.append(hmap_y)
        hMap_act_size.append(hmap_size)
        hMap_act_symbol.append(hmap_symbol)


    # ---- Create lineplot agents and attacks arrays --- #
    
    model_df = scenario.datacollector.get_model_vars_dataframe()
    
    cummax_model_df = model_df.cummax()
    max_y_agentattacks = list(cummax_model_df.max(axis=1))
    lPlot_nAttacks = list(model_df['num_attacks'])
    lPlot_nAgents = list(model_df['num_agents'])


    # ---- Add gov't cumulative actions ----- #

    govt_status_df = agents_df[agents_df.status.isin(['NONE','INDISC-REPR','INDISC-CONC','TARG-CONC','TARG-REPR'])].reset_index()
    govt_status_df.drop('AgentID', axis=1,inplace=True)
    govt_status_df = govt_status_df.sort_values('Step',ascending=True)
    govt_status_cum = govt_status_df.groupby(['status']).cumcount()
    govt_status_cum = govt_status_cum.rename('cumulative_actions')
    govt_status_cum = govt_status_df.join(govt_status_cum)
    # cumcount starts at 0, so rise to 1
    govt_status_cum['cumulative_actions'] = govt_status_cum['cumulative_actions'] + 1
    govt_status_cum = pd.get_dummies(govt_status_cum['status']).cumsum()

    lPlot_cumTargRepr = list(govt_status_cum['TARG-REPR'])
    lPlot_cumIndiscRepr = list(govt_status_cum['INDISC-REPR'])
    lPlot_cumTargConc = list(govt_status_cum['TARG-CONC'])
    lPlot_cumIndiscConc = list(govt_status_cum['INDISC-CONC'])

    return_vals = {'step':step,
                    'lPlot_nAttacks':lPlot_nAttacks,
                    'lPlot_nAgents':lPlot_nAgents,
                    'hMap_act_x':hMap_act_x,
                    'hMap_act_y':hMap_act_y,
                    'hMap_act_size':hMap_act_size,
                    'hMap_act_symbol':hMap_act_symbol,
                    'max_y_agentattacks':max_y_agentattacks,
                    'max_y_govtactions':max_y_govtactions,
                    'hMap_sympathy':hMap_sympathy,
                    'hMap_num_combats':hMap_num_combats,
                    'pChart_classes':pChart_classes,
                    'lPlot_cumTargRepr':lPlot_cumTargRepr,
                    'lPlot_cumIndiscRepr':lPlot_cumIndiscRepr,
                    'lPlot_cumTargConc':lPlot_cumTargConc,
                    'lPlot_cumIndiscConc':lPlot_cumIndiscConc}

    return return_vals

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--params", help="Dictionary of parameter options to run simulation")
    parser.add_argument(
        "--output_file",
        default='counterterrorism_dash/src/static/long_sim_response.json',
        help="JSON output file to store JSON of model outputs"
    )
    parser.add_argument(
        "--verbose",
        action='store_true',
        default=False,
        help="Whether to print out each model step; default=False"
    )

    parser.add_argument(
        "--cloud",
        action='store_true',
        default=False,
        help="Whether to run the model as a google cloud function (requires user creds to be stored in .cloud_identity, untracked by git); default=False"
    )

    args = parser.parse_args()
    params_dict = ast.literal_eval(args.params)
    
    print("Running simulation with parameters",params_dict)
    if args.cloud:
        print("Running in the cloud.")
        gcloud = json.load(open(".gcloud_identity.json"))['id']
        headers = {
            'Authorization': f"bearer {gcloud}",
        }
        response = requests.post(
            'https://us-central1-sci-comp-counterterror-model.cloudfunctions.net/counterterror_model_http',
            headers=headers,
            json=params_dict
        )
        return_vals = response.json()
        # with open(args.output_file, 'w') as j_path:
        #     json.dump(response.json(), j_path)
    else:
        print("Running locally.")
        return_vals = counterterror_model_http(params_dict, args.verbose)
        print("Successfully completed simulation")
    
    # out_file = args.output_file
    with open(args.output_file,'w') as f:
        json.dump(return_vals, f)

    print("Model results written to ",args.output_file)