import Plot from "react-plotly.js";

function HeatMap(props) {

    var yValues = ["A", "B"];

    var xValues = ["ㅤ3", "ㅤ2", "ㅤ1"];

    var colorscaleValue = [
        [0, "#d40000"],
        [1, "#0099ff"],
    ];

    const data = [
        {
            x: xValues,
            y: yValues,
            z: props.data.hMap_sympathy[props.timestep],
            zmin: 0.0,
            zmax: 1.0,
            type: "heatmap",
            hovertemplate: "Non-violence: %{z:.2f}%<extra></extra>",
            colorscale: colorscaleValue,
            showscale: false,
        },
        {
            x: props.data.hMap_act_x[props.timestep],
            y: props.data.hMap_act_y[props.timestep],
            mode: "markers",
            marker: {
                color: "#ffffff",
                size: props.data.hMap_act_size[props.timestep],
                symbol: props.data.hMap_act_symbol[props.timestep],
                line: {
                    width: 4,
                },
            },
        },
    ];

    var layout = {
        width: 850,
        height: 483,
        annotations: [],
        font: { size: 20 },
        paper_bgcolor: "#f5eeda",
        margin: {
            l: 35,
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

    for (var i = 0; i < xValues.length; i++) {
        for (var j = 0; j < yValues.length; j++) {
            var currentValue = props.data.hMap_sympathy[props.timestep][j][i];
            // if (currentValue != 0.0) {
            //     var textColor = "white";
            // } else {
            //     var textColor = "black";
            // }
            var textColor = "white";
            var result = {
                xref: "x1",
                yref: "y1",
                x: xValues[i],
                y: yValues[j],
                text: props.data.hMap_num_combats[props.timestep][j][i],
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
