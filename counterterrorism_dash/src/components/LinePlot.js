import React from "react";
import Plot from "react-plotly.js";

function LinePlot(props) {
    return (
        <Plot
            data={[
                {
                    x: props.data.timestep,
                    y: props.data[props.target1],
                    name: props.lab1,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(256,0,0,1)" },
                    showlegend: true,
                },
                {
                    x: props.data.timestep,
                    y: props.data[props.target2],
                    name: props.lab2,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(222,143,143,1)" },
                    showlegend: true,
                },
                {
                    x: props.data.timestep,
                    y: props.data[props.target3],
                    name: props.lab3,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(0,0,255,1)" },
                    showlegend: true,
                },
                {
                    x: props.data.timestep,
                    y: props.data[props.target4],
                    name: props.lab4,
                    type: "scatter",
                    mode: "lines",
                    marker: { color: "rgba(147,142,208,1)" },
                    showlegend: true,
                },
            ]}
            layout={{
                width: 640,
                height: 400,
                paper_bgcolor: "#f5eeda",
                legend: {
                    x: 1,
                    xanchor: "right",
                    y: 1,
                },
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
                    range: [0, props.data[props.yMax][props.timestep]],
                },
                xaxis: {
                    title: {
                        text: props.x_lab,
                        font: {
                            family: "Balto",
                            size: 14.5,
                        },
                    },
                    range: [-1, props.timestep],
                    tickmode: "linear",
                    tick0: 0,
                    dtick: props.x_step,
                },
            }}
        />
    );
}

export default LinePlot;
