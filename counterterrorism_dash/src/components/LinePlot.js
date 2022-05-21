import React from "react";
import Plot from "react-plotly.js";

function LinePlot(props) {
    const y_val1 = props.data[props.target1];
    const y_val2 = props.data[props.target2];
    const x_range = [-1, props.timestep];
    const y_max_t = Math.max(y_val1[props.timestep], y_val2[props.timestep]);

    if (props.lineYMax < y_max_t) {
        props.setLineYMax(y_max_t);
    }

    const y_range = [0, props.lineYMax];

    console.log(props.data.num_agents);
    return (
        <Plot
            data={[
                {
                    x: props.data.timestep,
                    y: y_val1,
                    name: "Agents",
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(0,100,80,1)" },
                    showlegend: true,
                },
                {
                    x: props.data.timestep,
                    y: y_val2,
                    name: "Attacks",
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(256,100,80,1)" },
                    showlegend: true,
                },
            ]}
            layout={{
                width: 550,
                height: 300,
                paper_bgcolor:"#f5eeda",
                margin: {
                    l: 25,
                    r: 25,
                    b: 25,
                    t: 25,
                    pad: 4,
                },
                yaxis: {
                    title: {
                        text: props.y_lab,
                        font: {
                            family: "Balto",
                            size: 14.5,
                        },
                    },
                    range: y_range,
                },
                xaxis: {
                    title: {
                        text: props.x_lab,
                        font: {
                            family: "Balto",
                            size: 14.5,
                        },
                    },
                    range: x_range,
                    tickmode: "linear",
                    tick0: 0,
                    dtick: props.x_step,
                },
            }}
        />
    );
}

export default LinePlot;
