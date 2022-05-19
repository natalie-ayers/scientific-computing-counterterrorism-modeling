import React from "react";
import Plot from "react-plotly.js";

function SensorZoom(props) {

  const y_low = props.data.parameter.map((e, i) => e - props.data.error[i])
  const y_high = props.data.parameter.map((e, i) => e + props.data.error[i])

  const step_mask = props.data.key.map((x) => x % 40 === 0)
  const x_lab_step = props.data.datetime.filter((_, i) => step_mask[i])
  const x_step = props.data.key.filter((_, i) => step_mask[i])
  const x_range = [props.loc - props.zoom, props.loc + props.zoom]

  const vis_mask = props.data.key.map((x) => x_range[0] <= x && x <= x_range[1])
  const y_range = [
      Math.min.apply(Math, y_low.filter((_, i) => vis_mask[i])),
      Math.max.apply(Math, y_high.filter((_, i) => vis_mask[i]))
  ]

  return (
    <Plot
      data={[
        {
          x: props.data.key,
          y: y_low,
          cliponaxis: true,
          fillcolor: "rgba(0,100,80,0.2)",
          line: { color: "transparent" },
          name: "Lower Interpolation Confidence",
          showlegend: false,
          type: "scatter",
        },
        {
          x: props.data.key,
          y: y_high,
          cliponaxis: true,
          fill: "tonexty",
          fillcolor: "rgba(0,100,80,0.2)",
          line: { color: "transparent" },
          name: "Upper Interpolation Confidence",
          showlegend: false,
          type: "scatter",
        },
        {
          x: props.data.key,
          y: props.data.parameter,
          cliponaxis: true,
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
              x0: props.loc - 2,
              x1: props.loc + 2,
              y0: 0,
              y1: 1,
              fillcolor: "#d3d3d3",
              opacity: 0.7,
              line: {
                width: 0,
              },
            },
          ],
        width: 700,
        height: 380,
        title: {
          text: "<b>Zoom View</b>",
          y: 0.7,
          x: 0.9,
          font: {
            family: "Balto",
            size: 22.5,
          },
        },
        yaxis: {
          range: y_range,
          title: {
            text: "Sensor Units",
            font: {
              family: "Balto",
              size: 14.5,
            },
          },
        },
        xaxis: {
          range: x_range,
          tickmode: 'array',
          tickvals: x_step,
          ticktext: x_lab_step
        }
      }}
    />
  );
}

export default SensorZoom;