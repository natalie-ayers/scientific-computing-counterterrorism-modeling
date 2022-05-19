import React from "react";
import Plot from "react-plotly.js";

function SensorPlot(props) {
  const mask = props.data.key.map((x) => x % Math.floor(props.data.key.length / 5) === 0)
  mask.unshift(true)
  const x_lab_step = props.data.datetime.filter((_, i) => mask[i])
  const x_step = props.data.key.filter((_, i) => mask[i])
  console.log(props.loc - props.zoom)

  return (
    <Plot
      data={[
        {
          x: props.data.key,
          y: props.data.parameter,
          type: "scatter",
          mode: "lines",
          name: "Sensor value",
          marker: { color: "rgba(0,100,80,1)" },
          showlegend: false,
        },
      ]}
      layout={{
        shapes: [
          {
            type: "rect",
            yref: 'paper',
            x0: props.loc - props.zoom*4,
            x1: props.loc + props.zoom*4,
            y0: 0,
            y1: 1,
            fillcolor: "#d3d3d3",
            opacity: 0.4,
            line: {
              width: 0,
            },
          },
        ],
        width: 700,
        height: 380,
        title: {
          text: "<b>Entire Dive</b>",
          y: 0.7,
          x: 0.9,
          font: {
            family: "Balto",
            size: 22.5,
          },
        },
        yaxis: {
          title: {
            text: "Sensor Units",
            font: {
              family: "Balto",
              size: 14.5,
            },
          },
        },
        xaxis: {
            tickmode: 'array',
            tickvals: x_step,
            ticktext: x_lab_step
          }
      }}
    />
  );
}

export default SensorPlot;