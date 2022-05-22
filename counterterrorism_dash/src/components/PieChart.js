import Plot from "react-plotly.js";

const PieChart = (props) => {
    const pct_vals = [
        [10, 20, 30, 40],
        [10, 25, 35, 30],
        [10, 30, 40, 20],
        [10, 35, 45, 10],
        [15, 35, 40, 10],
        [20, 30, 40, 10],
        [20, 30, 45, 5],
        [20, 30, 50, 0],
        [20, 25, 55, 0],
    ];
    var data = [
        {
            values: pct_vals[props.timestep],
            labels: ["Combatant", "Sympathetic", "Neutral", "Anti-Violence"],
            type: "pie",
            marker: {
                colors: ["#eb4034", "#eba534", "#6cd11f", "#1fd1d1"],
            },
        },
    ];

    var layout = {
        height: 410,
        width: 400,
        paper_bgcolor:"#f5eeda",
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
