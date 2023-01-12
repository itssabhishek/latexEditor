/**
*** LAGRIDA Yassine
**/
const newFetch = (url, options={}) => new Promise((resolve, reject) => {
    fetch(url, options)
    .then(response => {
        if(response.ok){
            response.json().then(data => resolve({response, data}));
        }else{
            response.json().then(data => reject({response,data}));
        }
    })
    .catch(response => {
        reject({response});
    });
});
