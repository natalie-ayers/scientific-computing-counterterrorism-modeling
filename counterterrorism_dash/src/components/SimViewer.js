import { useState, useEffect, useCallback } from "react";
// import fetchSim from "cloud_services";
import ParamForm from "./ParamForm";
import pivot_json from "../services/Services";
import LinePlot from "./LinePlot";
import Heatmap from "./Heatmap";
import PlaybackControls from "./PlaybackControls";

const SimViewer = (props) => {
  const [timestep, setTimestep] = useState(0);
  const [speed, setSpeed] = useState("t0");

  //   const [simData, setSimData] = useState(null)
  const simPars = {
    violence_prob: 0.001,
    gov_policy: "NONE",
    reactive_level: "HIGH",
    discontent: "LOW",
    starting_pop: 200,
    total_steps: 500,
  };

  const simData = require("../static/model_json.json");
  const simPiv = pivot_json(simData);
  console.log(simPiv);
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
    <div>
      <div className="sim_viewer">
        <div className="sim_viewer_left">
          <Heatmap></Heatmap>
        </div>
        <div className="sim_viewer_right" width="400" margin="50">
          <ParamForm></ParamForm>
        </div>
        <div>
          <PlaybackControls
            speed={speed}
            setSpeed={setSpeed}
          ></PlaybackControls>
        </div>
      </div>
      <div className="sim_viewer">
        {/* <div className="sim_viewer_right">
        <LinePlot
            data={simPiv}
            target1={'num_agents'}
            target2={'num_attacks'}
            x_step={50}>
        </LinePlot>
        </div> */}
        <div className="sim_viewer_left">
          <LinePlot
            data={simPiv}
            target1={"num_agents"}
            target2={"num_attacks"}
            x_step={50}
          ></LinePlot>
        </div>
      </div>
    </div>
  );
};
export default SimViewer;
