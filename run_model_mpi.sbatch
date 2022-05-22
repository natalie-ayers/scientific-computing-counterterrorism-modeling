#!/bin/bash

#SBATCH --job-name=run_model_mpi
#SBATCH --ntasks=2
#SBATCH --partition=broadwl

# Load Python and MPI modules
module load python/anaconda-2019.03
module load intelmpi/2018.2.199+intel-18.0

# Run models with mpirun
mpirun -n 2 python3 ./run_model_mpi_midway.py > ./run_model_mpi_midway.out 