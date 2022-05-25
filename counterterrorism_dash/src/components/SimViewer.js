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
    const [simPars, setSimPars] = useState({
        violence_prob: 0.001,
        gov_policy: "Low",
        reactive_level: "High",
        discontent: "Low",
        starting_pop: 200,
        total_steps: 375,
    });
    // when cloud function CORS permissions issue is resolved, can set simData state
    // const [simData, setSimData] = useState(null);

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

    const simData_tst = require("../static/long_sim_response.json");
    return (
        <div>
            <div className="sim_viewer">
                <div className="sim_viewer_tleft">
                    <HeatMap timestep={timestep} data={simData_tst}></HeatMap>
                </div>
                <div className="sim_viewer_tctr">
                    <PieChart timestep={timestep} data={simData_tst}></PieChart>
                    <div>
                        Timestep {timestep + 1} of {simData_tst.step.length}
                    </div>
                    <PlaybackControls
                        setMsPerStep={setMsPerStep}
                        setActive={setActive}
                        setTimestep={setTimestep}
                        setControlState={setControlState}
                        controlState={controlState}
                        timestep={timestep}
                        max_timestep={simData_tst.step.length - 1}
                    ></PlaybackControls>
                </div>
                <div className="sim_viewer_right" width="400" margin="50">
                    <ParamForm
                       setSimPars={setSimPars}
                    ></ParamForm>
                </div>
            </div>
            <div className="sim_viewer">
                <div className="sim_viewer_bleft">
                    <LinePlot
                        data={simData_tst}
                        target1={"lPlot_nAgents"}
                        lab1={"Agents"}
                        target2={"lPlot_nAttacks"}
                        lab2={"Attacks"}
                        x_step={50}
                        timestep={timestep}
                        yMax={"max_y_agentattacks"}
                    ></LinePlot>
                </div>
                <div className="sim_viewer_bctr">
                    <LinePlot
                        data={simData_tst}
                        target1={"lPlot_cumTargRepr"}
                        lab1={"Targeted Repression"}
                        target2={"lPlot_cumIndiscRepr"}
                        lab2={"Indiscriminate Repression"}
                        target3={"lPlot_cumTargConc"}
                        lab3={"Targeted Concilation"}
                        target4={"lPlot_cumIndiscConc"}
                        lab4={"Indiscriminate Concilation"}
                        yMax={"max_y_govtactions"}
                        x_step={50}
                        timestep={timestep}
                    ></LinePlot>
                </div>
            </div>
        </div>
    );
};
export default SimViewer;
