import axios from 'axios';
import { api_result, api_search_term, } from '../stores/title_model'

const API_BASE_URL = "https://api.themoviedb.org/3/search/movie?"
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzliYmI2ZDkyZjVmNjI3NWI5M2Y4N2EzYmNlZTE4YSIsIm5iZiI6MTczMjc2NjcyMS4yMDQ4NzE0LCJzdWIiOiI2NzQ3ZWE2NmNhYjBhMjM4ZGRkY2UyNzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nmqpxOV7MOefEyenk7YYYc64FA2-c_rY3M7CS-f15z0"

export function autoGenerate () {

    const options = {
      method: 'GET',
      url: `${API_BASE_URL}query=${api_search_term.value}&include_adult=false&language=en-US&page=1`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };
    axios.request(options)
    .then((res: any) => api_result.value  = res.data.results)
    .catch((err : any)=> console.error(err));
}