import Plot from "react-plotly.js";

function HeatMap(props) {
    var xValues = ["A", "B", "C", "D"];

    var yValues = ["ㅤ3", "ㅤ2", "ㅤ1"];

    var zValues = [
        [
            [0.0, 0.0, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.5, 0.0, 0.75],
        ],
        [
            [0.25, 0.25, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.25, 0.75],
        ],
        [
            [0.0, 0.0, 1, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 1, 0.75],
        ],
        [
            [0.0, 0.0, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.0, 0.75],
        ],
        [
            [0.25, 0.25, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.25, 0.75],
        ],
        [
            [0.0, 0.0, 1, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 1, 0.75],
        ],
        [
            [0.0, 0.0, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.0, 0.75],
        ],
        [
            [0.25, 0.25, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.25, 0.75],
        ],
        [
            [0.0, 0.0, 1, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 1, 0.75],
        ],
        [
            [0.0, 0.0, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.0, 0.75],
        ],
        [
            [0.25, 0.25, 0.75, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 0.25, 0.75],
        ],
        [
            [0.0, 0.0, 1, 0.75],
            [0.75, 0.75, 0.75, 0.75],
            [0.0, 0.0, 1, 0.75],
        ],
    ];

    var zAnnot = [
        [
            [0, 0, 0, 0],
            [0, 2, 3, 2],
            [0, 2, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 3, 2],
            [0, 2, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 4, 3, 2],
            [0, 4, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 5, 4, 3],
            [0, 7, 5, 3],
        ],
        [
            [0, 2, 1, 0],
            [0, 5, 5, 3],
            [0, 7, 9, 4],
        ],
        [
            [1, 2, 1, 0],
            [1, 6, 6, 4],
            [2, 9, 10, 4],
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 3, 2],
            [0, 2, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 3, 2],
            [0, 2, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 4, 3, 2],
            [0, 4, 4, 3],
        ],
        [
            [0, 0, 0, 0],
            [0, 5, 4, 3],
            [0, 7, 5, 3],
        ],
        [
            [0, 2, 1, 0],
            [0, 5, 5, 3],
            [0, 7, 9, 4],
        ],
        [
            [1, 2, 1, 0],
            [1, 6, 6, 4],
            [2, 9, 10, 4],
        ],
    ];

    var colorscaleValue = [
        [0, "#d40000"],
        [1, "#0099ff"],
    ];

    const data = [
        {
            x: xValues,
            y: yValues,
            z: zValues[props.timestep],
            type: "heatmap",
            hovertemplate: 'Non-violence: %{z:.2f}%<extra></extra>',
            colorscale: colorscaleValue,
            showscale: false,
        },
        {
            x: ['A', 'B', 'B'],
            y: ["ㅤ3", "ㅤ3", "ㅤ1"],
            text: ['Repression', 'Concilation', 'Indiscriminate Concilation'],
            mode: 'markers',
            marker: {
              color: "#ffffff",
              size: [80, 80, 50],
              symbol: [105, 106, 106],
              line: {
                width: 4
              }
            }
          }
    ];

    var layout = {
        width: 850,
        height: 483,
        annotations: [],
        font: { size: 20 },
        paper_bgcolor:"#f5eeda",
        margin: {
            l: 30,
            r: 25,
            b: 25,
            t: 35,
            pad: 4,
        },
        xaxis: {
            ticks: "",
            side: "top",
        },
        yaxis: {
            ticks: "",
            ticks: 1,
            ticksuffix: " ",
            autosize: false,
        },
    };

    for (var i = 0; i < yValues.length; i++) {
        for (var j = 0; j < xValues.length; j++) {
            var currentValue = zValues[i][j];
            if (currentValue != 0.0) {
                var textColor = "white";
            } else {
                var textColor = "black";
            }
            var result = {
                xref: "x1",
                yref: "y1",
                x: xValues[j],
                y: yValues[i],
                text: zAnnot[props.timestep][i][j],
                font: {
                    family: "Arial",
                    size: 20,
                    color: "rgb(50, 171, 96)",
                },
                showarrow: false,
                font: {
                    color: textColor,
                },
            };
            layout.annotations.push(result);
        }
    }
    return <Plot data={data} layout={layout}></Plot>;
}

export default HeatMap;
