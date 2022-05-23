#!/bin/bash

#SBATCH --job-name=run_model_mpi
#SBATCH --ntasks=2
#SBATCH --partition=broadwl
#SBATCH --time=08:00:00  

# Load Python and MPI modules
module load python/anaconda-2019.03
module load intelmpi/2018.2.199+intel-18.0

# Run models with mpirun
mpirun -n 2 python3 ./run_model_mpi.py > ./run_model_mpi.out 