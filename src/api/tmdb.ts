import axios from 'axios';
import { 
  api_result, 
  api_search_term, 
  titleStage,
  newTitle,
  base_image_url
} from '../stores/title_model'
import { client } from '@/model/title';


const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzliYmI2ZDkyZjVmNjI3NWI5M2Y4N2EzYmNlZTE4YSIsIm5iZiI6MTczMjc2NjcyMS4yMDQ4NzE0LCJzdWIiOiI2NzQ3ZWE2NmNhYjBhMjM4ZGRkY2UyNzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nmqpxOV7MOefEyenk7YYYc64FA2-c_rY3M7CS-f15z0"

export function autoGenerate () {

    titleStage.value.search_results = true
    const options = {
      method: 'GET',
      url: `${API_BASE_URL}/search/movie?query=${api_search_term.value}&include_adult=false&language=en-US&page=1`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      }
    };
    axios.request(options)
    .then((res: any) => api_result.value  = res.data.results)
    .catch((err : any)=> console.error(err));
}

export function fetchDetails (id: string) {
  const options = {
    method: 'GET',
    url: `${API_BASE_URL}/movie/${id}/credits?language=en-US`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    }
  }
  
  axios
  .request(options)
  .then(res => {
    addToData(res, id)
  })
  .catch(err => console.error(err));
}


async function addToData(res:  any, titleId: string) {
  const castDetails = getNamesAndRoles(res.data.cast, "character", titleId);
  const crewDetails = getNamesAndRoles(res.data.crew, "job", titleId);

  newTitle.value.cast = castDetails
  newTitle.value.crew = crewDetails

  // castDetails.forEach((member: any) => {
  //   console.log(titleId,member)

  //   client.models.Cast.create(member)
  // });

  // crewDetails.forEach(async (member: any) => {
  //   // const { data: title } = await client.models.Titles.update(member.titleId,member)
  //   // console.log(title)
  // });
}

function getNamesAndRoles(data: any[], roleKey: string, titleId: string): { name: string; role: string }[] {
  if (!data) return []; // Handle undefined data
  return data.map(person => ({
    titleId: titleId,
    name: person.name || "Unknown name",
    role: person[roleKey] || "Unknown role",
    profile_path: `${base_image_url}${person.profile_path}` || "No Image Found"
  }));
}