import { useState, useEffect } from "react";
// import fetchSim from "cloud_services";
import ParamForm from "./ParamForm";
import { pivot_json } from "../services/Services";
import LinePlot from "./LinePlot";
import HeatMap from "./HeatMap";
import PieChart from "./PieChart.js";
import PlaybackControls from "./PlaybackControls";

const SimViewer = (props) => {
    const [timestep, setTimestep] = useState(0);
    const [isActive, setActive] = useState(false);
    const [msPerStep, setMsPerStep] = useState(1000);
    const [controlState, setControlState] = useState("pause");
    const [lineYMax, setLineYMax] = useState(0);
    const [simPars, setSimPars] = useState({
        violence_prob: 0.001,
        gov_policy: "Low",
        reactive_level: "High",
        discontent: "Low",
        starting_pop: 200,
        total_steps: 500,
    });
    // const [simData, setSimData] = useState(null)

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTimestep((timestep) => timestep + 1);
            }, msPerStep);
        } else if (!isActive && timestep !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timestep]);

    const simData = require("../static/model_json.json");
    const simPiv = pivot_json(simData);

    // console.log(simPiv);
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

    return (
        <div>
            <div className="sim_viewer">
                <div className="sim_viewer_tleft">
                    <HeatMap timestep={timestep}></HeatMap>
                </div>
                <div className="sim_viewer_tctr">
                    Timestep {timestep} of {simPars.total_steps}
                    <PieChart timestep={timestep}></PieChart>
                </div>
                <div className="sim_viewer_right" width="400" margin="50">
                    <ParamForm setSimPars={setSimPars}></ParamForm>
                    <PlaybackControls
                        setMsPerStep={setMsPerStep}
                        setActive={setActive}
                        setTimestep={setTimestep}
                        setControlState={setControlState}
                        controlState={controlState}
                        timestep={timestep}
                        max_timestep={simPars.total_steps}
                    ></PlaybackControls>
                </div>
            </div>
            <div className="sim_viewer">
                <div className="sim_viewer_bleft">
                    <LinePlot
                        data={simPiv}
                        target1={"num_agents"}
                        target2={"num_attacks"}
                        x_step={50}
                        timestep={timestep}
                        lineYMax={lineYMax}
                        setLineYMax={setLineYMax}
                    ></LinePlot>
                </div>
                <div className="sim_viewer_bctr">
                    <LinePlot
                        data={simPiv}
                        target1={"num_agents"}
                        target2={"num_attacks"}
                        x_step={50}
                        timestep={timestep}
                        lineYMax={lineYMax}
                        setLineYMax={setLineYMax}
                    ></LinePlot>
                </div>
            </div>
        </div>
    );
};
export default SimViewer;
