import React, { Component } from "react";
import Slider, { Range } from "rc-slider";
import LoadingButton from "@mui/lab/LoadingButton";
import "rc-slider/assets/index.css";
import { BsCloudUpload } from "react-icons/bs";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import { useState } from "react";

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

const ParamForm = (props) => {
    const [govPolicy, setGovPolicy] = useState("Neutral");
    const [govReactivity, setGovReactivity] = useState("Medium");
    const [discontent, setDiscontent] = useState("Medium");
    const [startingPop, setStartingPop] = useState(600);
    const [baseViolPct, setBaseViolPct] = useState(600);
    const [nSteps, setNSteps] = useState(600);
    const [waitingForSim, setWaitingForSim] = useState(false);

    return (
        <>
            Government Policy
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
            Government Reactivity
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
            Discontent
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
            Baseline Violence Probability
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
            Starting Population
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
            Number of Steps
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
                            starting_pop: startingPop,
                            total_steps: nSteps,
                        });
                    }}
                >
                    Simulate
                </LoadingButton>
            </div>
        </>
    );
};

export default ParamForm;
