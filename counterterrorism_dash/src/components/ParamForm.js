import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { BsCloudUpload } from "react-icons/bs";
import { fetchSim } from '../services/Services.js'

const gov_policy_options = {
    0: "Concilatory",
    1: "Neutral",
    2: "Repressive",
};

const reactive_level_options = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Extreme",
};

const discontent_options = {
    0: "Low",
    1: "Medium",
    2: "High",
};

const numeric_options = {
    200: "200",
    // 300: '300',
    400: "400",
    // 500: '500',
    600: "600",
    // 700: '700',
    800: "800",
    // 900: '900',
    1000: "1,000",
};

const violence_prob_options = {
    0: ".01%",
    1: ".05%",
    2: ".1%",
    3: ".3%",
    4: ".5%",
    5: ".8%",
    6: "1%",
};

const agent_crowding_options = {
    0: "10",
    1: "20",
    2: "30",
    3: "40",
    4: "50",
    5: "60",
    6: "70",
};

const viol_aftermath_options = {
    0: "2",
    1: "3",
    2: "4",
    3: "5",
    4: "10",
    5: "15",
    6: "30",
};

const birth_rate_options = {
    0: ".01%",
    1: ".02%",
    2: ".03%",
    3: ".05%",
    4: ".1%",
    5: ".5%",
    6: "1%",
};

const ParamForm = (props) => {
    const [govPolicy, setGovPolicy] = useState("Neutral");
    const [govReactivity, setGovReactivity] = useState("Medium");
    const [discontent, setDiscontent] = useState("Medium");
    const [startingPop, setStartingPop] = useState("600");
    const [baseViolPct, setBaseViolPct] = useState("600");
    const [nSteps, setNSteps] = useState("600");
    const [addViol, setAddViol] = useState("5");
    const [crowdingThresh, setCrowdingThresh] = useState("40");
    const [birthRate, setBirthRate] = useState(".05%");

    const [waitingForSim, setWaitingForSim] = useState(false);

    const sim_params = {
        "violence_prob": 0.0005,
        "gov_policy": "None",
        "reactive_level": "Low",
        "discontent": "Mid",
        "starting_pop": 200,
        "total_steps": 30,
        "add_violence_aftermath":10,
        "crowding_threshold":30,
        "agent_birth_rate":0.03
    }

    const styleObj = {
        fontSize: 16,
        textAlign: "center",
    }

    return (
        <>
            <div>
                <div className="sim_lab">ㅤㅤGOVㅤㅤㅤ</div>
                <div className='contain_org'>
                    <p style={styleObj}>Government Policy</p>
                    <div className="contain_inner">
                        <Slider
                            fluid
                            label="Government Policy"
                            onAfterChange={(value) =>
                                setGovPolicy(gov_policy_options[value])
                            }
                            marks={gov_policy_options}
                            min={0}
                            max={2}
                            defaultValue={1}
                        />
                    </div>
                    <p style={styleObj}>Government Reactivity</p>
                    <div className="contain_inner">
                        <Slider
                            fluid
                            label="Government Reactivity"
                            marks={reactive_level_options}
                            onAfterChange={(value) =>
                                setGovReactivity(reactive_level_options[value])
                            }
                            min={0}
                            max={4}
                            defaultValue={2}
                        />
                    </div>
                </div>
            </div>
            <div>
            <div className="sim_lab">ㅤㅤㅤㅤㅤAGENTSㅤㅤㅤㅤㅤㅤ</div>
            <div className='contain_org'>
                <p style={styleObj}>Discontent</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Discontent"
                        marks={discontent_options}
                        onAfterChange={(value) =>
                            setDiscontent(discontent_options[value])
                        }
                        min={0}
                        max={2}
                        defaultValue={1}
                    />
                </div>
                <p style={styleObj}>Agent Birth Rate</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Agent Birth Rate"
                        marks={birth_rate_options}
                        onAfterChange={(value) =>
                            setBirthRate(birth_rate_options[value])
                        }
                        min={0}
                        max={6}
                        defaultValue={3}
                    />
                </div>
                <p style={styleObj}>Crowding Threshold</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Crowding Threshold"
                        marks={agent_crowding_options}
                        onAfterChange={(value) =>
                            setCrowdingThresh(agent_crowding_options[value])
                        }
                        min={0}
                        max={6}
                        defaultValue={3}
                    />
                </div>
                <p style={styleObj}>Add. Violence Aftermath</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Add. Violence Aftermat"
                        marks={viol_aftermath_options}
                        onAfterChange={(value) =>
                            setAddViol(viol_aftermath_options[value])
                        }
                        min={0}
                        max={6}
                        defaultValue={3}
                    />
                </div>
                <p style={styleObj}>Baseline Violence Probability</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Discontent"
                        marks={violence_prob_options}
                        onAfterChange={(value) =>
                            setBaseViolPct(violence_prob_options[value])
                        }
                        min={0}
                        max={6}
                        defaultValue={3}
                    />
                </div>
            </div>
            </div>
            <div>
            <div className="sim_lab">ㅤㅤSIMㅤㅤㅤ</div>
            <div className='contain_org'>
            <p style={styleObj}>Starting Population</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Starting Pop"
                        min={200}
                        max={1000}
                        marks={numeric_options}
                        onAfterChange={(value) =>
                            setStartingPop(numeric_options[value])
                        }
                        step={100}
                        dots={true}
                        defaultValue={600}
                    />
                </div>
                <p style={styleObj}>Number of Steps</p>
                <div className="contain_inner">
                    <Slider
                        fluid
                        label="Number of Steps"
                        min={200}
                        max={1000}
                        marks={numeric_options}
                        onAfterChange={(value) => setNSteps(numeric_options[value])}
                        step={100}
                        dots={true}
                        defaultValue={600}
                    />
                </div>
            </div>
            </div>
            <div className="sim_button">
                    <LoadingButton
                        loadingPosition="start"
                        startIcon={<BsCloudUpload />}
                        variant="outlined"
                        loading={waitingForSim}
                        onClick={() => {
                            setWaitingForSim(true);
                            props.setSimPars({
                                violence_prob: baseViolPct,
                                gov_policy: govPolicy,
                                reactive_level: govReactivity,
                                discontent: discontent,
                                add_violence_aftermath:addViol,
                                crowding_threshold:crowdingThresh,
                                agent_birth_rate:birthRate,
                                starting_pop: startingPop,
                                total_steps: nSteps,
                            });
                            const fetched = fetchSim(sim_params)
                            console.log(fetched)
                        }}
                    >
                        Simulate
                    </LoadingButton>
                </div>
        </>
    );
};

export default ParamForm;
