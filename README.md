# Counterterrorism Simulations and Simulation Analyses

## Base Simulation

The base simulation is stored in model.py, and one example of running the model with desired parameters and analyzing the results is found in `local_model.ipynb`. Opening and running through the cells in `local_model.ipynb` is the simplest entry-point to become familiar with the model's functioning.  
This model was also uploaded as a Google Cloud Platform Cloud Function, enabling it to be called and run with any combination of parameters. 


## Interactive Visualization

The output of the model can also be visualized in an interactive React dashboard, with instructions below. First, to create the simulation data which the dashboard will use, you can either run the GCP Cloud Function above, or run a model locally using:  
  
`python counterterror_model_json_output.py --params='{"violence_prob": 0.0005,"gov_policy": "None","reactive_level": "none","discontent": "Mid","starting_pop": 200,"total_steps": 400,"add_violence_aftermath":10,"crowding_threshold":30,"agent_birth_rate":0.03}' --output_file="counterterror_json_output_demonstration.json" --verbose=True`

The params are all optional, so you can set as many or as few as you want to change. The verbose flag, if true, will print out each step of the model as it occurs. 

Once you have the json output from this `counterterror_model_json_output.py` script, it can be loaded into the dashboard.   

To run the docker image and see the React dashboard:

```
cd counterterrorism_dash
npm start
```

Then, in your browser, navigate to:
```
http://localhost:3000/
```


## Large-Scale Simulation Runs

A combination of simulations with multiple combinations of parameters can be run using slurm on Mdidway 2. The .sbatch script is `run_model_mpi.sbatch`, and this runs `run_model_mpi.py`. Runs are distributed over multiple nodes using MPI, then result dataframes for each simulation are stored as pickled dictionaries of Pandas dataframes. The resulting pickled data from our run of 2700 parameter combinations is stored in `model_output`as `model_output_dfs.zip`. A list of all parameter combinations and the time to run these is also stored in `model_output/run_model_mpi.out`. 

### Comparisons of Simulations with Real-World Data

The simulations were compared with real-world data using the same datasource as Dugan and Chenoweth (2012) of terrorist attacks. The results from each simulation were distributed as-if occurring over the same time period as our real data, 1987-2004, and then both sets of monthly attack data were normalized for more accurate comparison.  
  
This comparison work is done in `compare_model_and_real_dists.ipynb` using the non-parametric Kolmogorov-Smirnov test to compare distributions of monthly attacks from the simulations with our real-world data. For the 2,700 simulations we created, 47 were similar at the 0.01 significance level.  

Additional comparative work was done in the R Markdown script stored in `r_optimal_transport_comparisons/`. This work attempts to compare distributions using optimal transport, but was unfortunately not successful due to differences in content and values between the observed and simulated data.  

## Mid-Simulation Parameter Changes

In order to perform further analysis on the simulations, such as considering whether a policy change or other change to the model's context mid-simulation, we also developed `rd_model.py` and the associated `rd_model_simulations.ipynb` notebook to demonstrate. This version of the model is identical to the original in `model.py`, except it accepts a new set of parameters to switch to half-way through the model's running. We believe this should allow for analyses such as a regression discontinuity, by comparing the effect of changing a single parameter from another while leaving all other parameters unchanged. 




