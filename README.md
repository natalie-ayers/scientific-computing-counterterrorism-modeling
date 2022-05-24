# Counterterrorism Simulations and Simulation Analyses

## Base Simulation

The base simulation is stored in model.py, and one example of running the model with desired parameters and analyzing the results is found in local_model.ipynb. This model was also uploaded as a Google Cloud Platform Cloud Function, enabling it to be called and run with any combination of parameters. 


## Interactive Visualization

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


## Mid-Simulation Parameter Changes

In order to perform further analysis on the simulations, such as considering whether a policy change or other change to the model's context mid-simulation, we also developed `rd_model.py` and the associated `rd_model_simulations.ipynb` notebook to demonstrate. This version of the model is identical to the original in `model.py`, except it accepts a new set of parameters to switch to half-way through the model's running. We believe this should allow for analyses such as a regression discontinuity, by comparing the effect of changing a single parameter from another while leaving all other parameters unchanged. 


