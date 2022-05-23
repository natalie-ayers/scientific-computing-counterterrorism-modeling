from mpi4py import MPI
import matplotlib.pyplot as plt
import numpy as np
import time
import model as mod_model
import itertools
import pandas as pd
import seaborn as sns


def sim_counterterrorism_models():
    """
    Run counterterrorism model distributed across nodes using MPI,
        creating parameter combinations on each node. Store the results
        and create visualizations for some pre-specified model choices.
    """

    # Define parameter value combinations to test
    prob_violence = [0.0001, 0.0005, 0.001, 0.003, 0.005, 0.01]
    #prob_violence = [0.0001, 0.003]
    #govt_policy = ['CONC']
    govt_policy = ['NONE','CONC','REPR']
    #reactive_lvl=['mid-high','none']
    reactive_lvl = ['high','mid-high','mid-low','low','none']
    discontent = ['high','mid','low']
    starting_population = [300, 600]
    #starting_population = [200, 300, 400, 600, 800, 1000]
    grid_size = {200:(2,3),300:(3,3),400:(3,4),600:(4,5),\
                  800:(5,5),1000:(5,6)}
    steps = [200, 300, 500, 700, 900]
    #steps = [200, 500]

    full_params = [prob_violence, govt_policy, reactive_lvl, discontent, \
                    starting_population,steps]
    param_options = list(itertools.product(*full_params))

    # Get rank of process and overall size of communicator:
    comm = MPI.COMM_WORLD
    rank = comm.Get_rank()
    size = comm.Get_size()

    # Start time:
    t0 = time.time()

    # calculate number of different paramaterized models
    n_runs = len(param_options)

    N = int(n_runs / size)
    if rank == (size - 1):
        params_resp = param_options[rank*N:]
    else:
        params_resp = param_options[rank*N:(rank*N)+N]

    results_dicts = []
    for params in params_resp:
        return_dict = {'params':params}
        prob_violence, govt_policy, reactive_lvl, discontent,\
        starting_population, steps = params
        height, width = grid_size[starting_population]
        model = mod_model.CounterterrorismModel(N=starting_population,height=height,\
                                                width=width,prob_violence=prob_violence,\
                                                policy=govt_policy,reactive_lvl=reactive_lvl,\
                                                discontent=discontent)
        for i in range(steps):
            model.step()

        model_df = model.datacollector.get_model_vars_dataframe()
        agents_df = model.datacollector.get_agent_vars_dataframe()
        deaths_df = model.datacollector.get_table_dataframe('Deaths')
        govt_actions_df = model.datacollector.get_table_dataframe('govt_actions')

        # get values from model dataframe
        return_dict['final_pop'] = int(model_df[model_df.index == steps-1]\
            ['num_agents'].values[0])
        return_dict['total_num_attacks'] = model_df[model_df.index == steps-1]\
            ['num_attacks'].values[0]

        # process agents dataframe
        agents_df = agents_df.reset_index()
        agents_df['step_cat'] = agents_df.Step.astype('str')
        agent_stati_gb = agents_df.groupby(by=['step_cat','status'])
        agent_stati = agent_stati_gb['AgentID'].nunique().reset_index()
        agent_stati = agent_stati.rename(columns={'AgentID':'num_agents'})
        agent_stati['step'] = agent_stati.step_cat.astype('int')

        # get Palestinian actors dataframe
        palestinian_stati = agent_stati[agent_stati.status.isin(['anti-violence','combatant','neutral','sympathetic'])]
        return_dict['palestinian_stati'] = palestinian_stati

        # get dominant sentiments and proportion of sentiments at end 
        dominant_sentiments = np.zeros((model.grid.width, model.grid.height))
        dominant_sentiments = dominant_sentiments.astype(str)
        dominant_sentiments[dominant_sentiments=='0.0'] = 'none'
        percent_dominant_sentiments = np.zeros((model.grid.width, model.grid.height))

        for cell in model.grid.coord_iter():
            cell_content, x, y = cell
            status_dict = {'anti-violence':0,'NONE':0,'neutral':0,'sympathetic':0,\
                'combatant':0,'TARG-CONC':0,'TARG-REPR':0,'INDISC-CONC':0,'INDISC-REPR':0}
            for agent in cell_content:
                status_dict[agent.status] += 1
            dominant_sentiment = max(status_dict)
            if len(cell_content) > 0:
                perc_dominant_sentiment = max(status_dict.values())/len(cell_content)
            else:
                perc_dominant_sentiment = 0

            dominant_sentiments[x][y] = dominant_sentiment 
            percent_dominant_sentiments[x][y] = perc_dominant_sentiment  

        return_dict['dominant_sentiments'] = dominant_sentiments
        return_dict['percent_dominant_sentiments'] = percent_dominant_sentiments

        # get Israeli government actions dataframes
        govt_status = agent_stati[agent_stati.status.isin(['NONE','INDISC-REPR',\
                                                            'INDISC-CONC','TARG-CONC',\
                                                            'TARG-REPR'])]
        govt_status.drop('num_agents', axis=1,inplace=True)
        govt_status = govt_status.sort_values('step',ascending=True)
        govt_status_cum = govt_status.groupby(['status']).cumcount()
        govt_status_cum = govt_status_cum.rename('cumulative_actions')
        govt_status_cum = govt_status.join(govt_status_cum)

        return_dict['govt_actions'] = govt_actions_df
        return_dict['govt_status_cum'] = govt_status_cum 
        return_dict['num_targ_conc'] = govt_status_cum[govt_status_cum.status == \
                                                        'TARG-CONC']['cumulative_actions'].max()
        return_dict['num_indisc_conc'] = govt_status_cum[govt_status_cum.status == \
                                                        'INDISC-CONC']['cumulative_actions'].max()
        return_dict['num_targ_repr'] = govt_status_cum[govt_status_cum.status == \
                                                        'TARG-REPR']['cumulative_actions'].max()
        return_dict['num_indisc_repr'] = govt_status_cum[govt_status_cum.status == \
                                                        'INDISC-REPR']['cumulative_actions'].max()
        
        # add raw dataframes to dicts
        return_dict['deaths_df'] = deaths_df
        return_dict['model_df'] = model_df

        results_dicts.append(return_dict)

        model_time = time.time() - t0
        print('model with params',params,'took',model_time,'to run on rank',rank)

    final_results_lol = comm.gather(results_dicts, root=0)

    if rank == 0:
        final_results = []
        for lol in final_results_lol:
            final_results.extend(lol)

        attacks_idx, highest_attacks = find_dict(final_results, 'total_num_attacks')
        max_attacks = final_results[attacks_idx]
        print('max attacks occurred with params:',max_attacks['params'])
        create_visualizations(max_attacks, 'max_attacks', highest_attacks)

        pop_idx, final_pop = find_dict(final_results, 'final_pop')
        highest_pop = final_results[pop_idx]
        print('highest pop occurred with:',highest_pop['params'])
        create_visualizations(highest_pop, 'highest_pop', final_pop)

        final_statistics = create_final_output(final_results)
        print('final results from all runs:',final_statistics)

        total_time = time.time() - t0
        print('overall runtime for',n_runs,'parameter combinations on',size,'nodes\
        was',total_time)

    return

def find_dict(dict_list, key):
    """
    Find the model with the highest value of the provided key
    Inputs:
        dict_list (list of model dictionary results)
        key (str): model value to evaluate
    Return:
        idx_highest (int): index location of desired model
        highest (int): highest value 
    """

    highest = 0
    idx = 0
    for idx, dict in enumerate(dict_list):
        dict_val = dict[key]
        if dict_val > highest:
            highest = dict_val
            idx = idx
    return idx, highest

def create_final_output(dict_list):
    """
    Create final, full dataframes and results dictionaries to save for 
    any future required study
    Inputs:
        dict_list (list of model dictionary results)
    """
    # create empty dataframes for concatenating
    palestinian_stati_df = pd.DataFrame(columns=['step_cat','status',\
                                                'num_agents','step','params'])
    govt_actions_df = pd.DataFrame(columns=['step','govt_action','action_loc',\
                                                'violence_aftermath','params'])
    govt_status_cum_df = pd.DataFrame(columns=['step_cat','status',\
                                                'step','cumulative_actions','params'])
    full_deaths_df = pd.DataFrame(columns=['step','deaths','params'])
    full_models_df = pd.DataFrame(columns=['num_agents','num_attacks','params'])
    final_results = []

    # create full dataframes 
    for idx, model_dict in enumerate(dict_list):
        param_vals = model_dict['params']
        palestinian_df = model_dict['palestinian_stati']
        palestinian_df = palestinian_df.assign(params = str(param_vals))
        govt_actions = model_dict['govt_actions']
        govt_actions = govt_actions.assign(params = str(param_vals))
        govt_status_cum = model_dict['govt_status_cum']
        govt_status_cum = govt_status_cum.assign(params = str(param_vals))
        deaths_df = model_dict['deaths_df']
        deaths_df = deaths_df.assign(params = str(param_vals))
        model_df = model_dict['model_df']
        model_df = model_df.assign(params = str(param_vals))

        palestinian_stati_df = palestinian_stati_df.append(palestinian_df, \
                                                            ignore_index=True)
        govt_actions_df = govt_actions_df.append(govt_actions, ignore_index=True)
        govt_status_cum_df = govt_status_cum_df.append(govt_status_cum, \
                                                        ignore_index=True)
        full_deaths_df = full_deaths_df.append(deaths_df, ignore_index=True)
        full_models_df = full_models_df.append(model_df, ignore_index=True)

        final_results.append({'params':param_vals,\
                                'final_pop':model_dict['final_pop'],\
                                'total_num_attacks':model_dict['total_num_attacks'],\
                                'dominant_sentiments':model_dict['dominant_sentiments'].tolist(),\
                                'percent_dominant_sentiments':\
                                    model_dict['percent_dominant_sentiments'].tolist(),\
                                'num_targ_conc':model_dict['num_targ_conc'],\
                                'num_indisc_conc':model_dict['num_indisc_conc'],\
                                'num_targ_repr':model_dict['num_targ_repr'],\
                                'num_indisc_repr':model_dict['num_indisc_repr']
                                })

    palestinian_stati_df.to_pickle('palestinian_stati_df.pkl')
    govt_actions_df.to_pickle('govt_actions_df.pkl')
    govt_status_cum_df.to_pickle('govt_status_cum_df.pkl')
    full_deaths_df.to_pickle('full_deaths_df.pkl')
    full_models_df.to_pickle('full_models_df.pkl')

    return final_results

def create_visualizations(result_dict, file_suffix, identifier):
    """
    Create useful visualizations and save for the provided results
    of a model's run (one of the result_dicts objects)
    Inputs:
        result_dict: a single object from the results_dict list
        file_suffix: any desired text to append to the name of the
        visualizations for this run
        identifier: a summary statistic from the results to append to
        image name
    """

    result_dict['model_df'].plot()
    plt.savefig('attacks-and-agents-%s-%d.png' % (file_suffix, identifier))

    sns.set(style='darkgrid')
    plt.figure(figsize=(20,10))

    prob_violence, govt_policy, reactive_lvl, discontent,\
        starting_population, steps = result_dict['params']
    sns.barplot(x='step',y='num_agents',hue='status',\
                data=result_dict['palestinian_stati']\
                [result_dict['palestinian_stati'].\
                    step.isin(range(1,steps,round(steps*0.05)))])
    plt.savefig('palestinian_stati_bar-%s-%d.png' % (file_suffix, identifier))

    plt.figure(figsize=(20,10))
    vals_to_int = {j:i for i, j in enumerate(pd.unique(result_dict['dominant_sentiments'].ravel()))}
    n = len(vals_to_int)
    cmap = sns.color_palette('Spectral', n)
    dominant_sentiments_df = pd.DataFrame(result_dict['dominant_sentiments'])
    ax = sns.heatmap(dominant_sentiments_df.replace(vals_to_int),cmap=cmap)
    colorbar = ax.collections[0].colorbar
    r = colorbar.vmax - colorbar.vmin
    colorbar.set_ticks([colorbar.vmin + r / n * (0.5 + i) for i in range(n)])
    colorbar.set_ticklabels(list(vals_to_int.keys()))
    plt.savefig('dominant_sentiments-%s-%d.png' % (file_suffix, identifier))

    plt.figure(figsize=(20,10))
    sns.lineplot(x='step',y='cumulative_actions',hue='status',\
                data=result_dict['govt_status_cum'])
    plt.savefig('govt_status_cumulative-%s-%d.png' % (file_suffix, identifier))

def main():
    sim_counterterrorism_models()

if __name__ == '__main__':
    main()