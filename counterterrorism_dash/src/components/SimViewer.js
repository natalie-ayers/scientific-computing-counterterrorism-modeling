import { useState, useEffect, useCallback } from "react";
// import fetchSim from "cloud_services";
import ParamForm from "./ParamForm";
import pivot_json from "../services/Services"
import LinePlot from "./LinePlot";

const SimViewer = (props) => {
  const [timestep, setTimestep] = useState(0);
//   const [simData, setSimData] = useState(null)
  const simPars = {
    violence_prob: .001,
    gov_policy: 'NONE',
    reactive_level: 'HIGH',
    discontent: 'LOW',
    starting_pop: 200,
    total_steps: 500
  };

  const simData = require('../static/model_json.json');
  const simPiv = pivot_json(simData)
  console.log(simPiv)
  // Retrive data for target parameter from server, set it to state,
  // update it when dive_meta changes
//   useEffect(() => {
//     console.log("Calling Google Cloud for new simulation")
//     const callSimData = async () => {
//       const simulation = await fetchSim(simPars);
//       setSimData(simulation)
//     }
//     callSimData(simPars);
//   }, [simPars]);

  const zoom = 5;
  return (
    <div className="sim_viewer">
            <div className="sim_viewer_left">
            <div>
                <LinePlot
                    data={simPiv}
                    target1={'num_agents'}
                    target2={'num_attacks'}
                    x_step={50}>
                </LinePlot>
                <LinePlot
                    data={simPiv}
                    target1={'num_agents'}
                    target2={'num_attacks'}
                    x_step={50}>
                </LinePlot>
            </div>
            <table id="sim_meta">
                <tr>
                    <td>{simPars.violence_prob}</td>
                    <td>{simPars.gov_policy}</td>
                    <td>{simPars.reactive_level}</td>
                    <td>{simPars.discontent}</td>
                    <td>{simPars.starting_pop}</td>
                    <td>{simPars.total_steps}</td>
                    <td>{timestep}</td>
                </tr>
            </table>
            </div>
            <div className="sim_viewer_right" width='400' margin='50'>
            <ParamForm></ParamForm>
            </div>
    </div>
  );
};
export default SimViewer;