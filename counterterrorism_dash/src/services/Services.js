// Call Google Cloud function to pull a new simulation
// const fetchSim = async () => {
//     return None;
//   };

const pivot_json = (props) => {
    let data_array = {};
    Object.keys(props[0]).forEach(k => {
        data_array[k] = props.map(o => o[k]);
    });
    return data_array;
};

export default pivot_json