import Plot from "react-plotly.js";

const PieChart = (props) => {
    var data = [
        {
            values: props.data.pChart_classes[props.timestep],
            labels: ["Combatant", "Sympathetic", "Neutral", "Anti-Violence"],
            type: "pie",
            marker: {
                colors: ["#eb4034", "#eba534", "#6cd11f", "#1fd1d1"],
            },
            sort: false,
        },
    ];

    var layout = {
        height: 410,
        width: 400,
        paper_bgcolor: "#f5eeda",
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 10,
            pad: 4,
        },
    };

    return <Plot data={data} layout={layout}></Plot>;
};

export default PieChart;
