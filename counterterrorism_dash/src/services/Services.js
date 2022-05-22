// Call Google Cloud function to pull a new simulation

export async function fetchSim(sim_params) {

    const url = "https://us-central1-sci-comp-counterterror-model.cloudfunctions.net/counterterror_model_http";
    const gcloud_identity = require("../.gcloud_identity.json");
    const auth_prefix = "Authorization:bearer ";
    const auth_text = auth_prefix.concat(gcloud_identity.id);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Security-Policy': "default-src",
            // mode: 'cors', // no-cors, *cors, same-origin
            Authorization: auth_text,
            body: JSON.stringify(sim_params) 
        }
    };
    
    const res = await fetch(url, options)
    console.log(res.status)
    //   .then( res => res.json() )
    //   .then( data => {
    //       console.log('data is ... ', data);
    //       return data;
    //     })
    //   .catch( err  => {
    //       console.log('error is ...',  err );
    //       throw err;
    //   });
};

export function pivot_json(props) {
    let data_array = {};
    Object.keys(props[0]).forEach((k) => {
        data_array[k] = props.map((o) => o[k]);
    });
    return data_array;
};

// export default fetchSim(props) {
//     const data_array = {};
//     Object.keys(props[0]).forEach((k) => {
//         data_array[k] = props.map((o) => o[k]);
//     });
//     return data_array;
// };

// const exported = {
//     fetchSim, pivot_json
// }

// export default exported;

// export default fetchSim;