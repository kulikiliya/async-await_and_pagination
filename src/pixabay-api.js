import axios from "axios";

// axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['Authorization'] = "39033383-61403046dd5e6a3052ef44954";
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// const KEY_AUTHOR = '39033383-61403046dd5e6a3052ef44954';
const baseURL = 'https://pixabay.com/api/'
// let page = 1;
// let searchQuary = ''

// const url = `${baseURL}key=${KEY_AUTHOR}&q=${searchQuary}&image_type=photo&orientation=horizontal&safesearch=true`
// const url2 = 'https://pixabay.com/api/?key=39033383-61403046dd5e6a3052ef44954&q=cat'
// const test = axios.get(url)
// console.log(test);

const getData = async (value, page) => {
    const {data} = await axios.get(baseURL, {
        params: { 
            key: '39033383-61403046dd5e6a3052ef44954',
            q: `${value}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: "true",
            page: page,
            per_page: 40
     }
    });
    
console.log(data)
    return data

}

export {getData}