import React from "react";
import Plot from "react-plotly.js";

function LinePlot(props) {
  //   const mask = props.data.timestep.map((x) => x % Math.floor(props.data.timestep.length / 50) === 0)
  //   mask.unshift(true)
  //   const x_step = props.data.timestep.filter((_, i) => mask[i])
  const y_val1 = props.data[props.target1];
  const y_val2 = props.data[props.target2];

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
        width: 700,
        height: 300,
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
        },
        xaxis: {
          title: {
            text: props.x_lab,
            font: {
              family: "Balto",
              size: 14.5,
            },
          },
          tickmode: "linear",
          tick0: 0,
          dtick: props.x_step,
        },
      }}
    />
  );
}

export default LinePlot;
