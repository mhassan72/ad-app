// Import Dependencies
import { ref } from 'vue'
import type { Schema } from '../../amplify/data/resource';

// Title satte mangament here
// Reactive reference to store the array of titles
export const titlesList : any = ref<Array<Schema['Titles']>>([]);
export const newTitle = ref({id: '',title: '',plot: '', poster_path:  '',  backdrop_path: ''})
export const api_result : any = ref([])
export const api_search_term : any = ref('')
export const base_image_url = "https://image.tmdb.org/t/p/w500"


export async function generateTitle (data: any) {
  let poster_url = ''
  let backdrop_url = ''

  if(data.poster_path)  poster_url  = `${base_image_url +  data.poster_path}`
  if(data.backdrop_path)  backdrop_url  = `${base_image_url +  data.backdrop_path}`


  newTitle.value = {
    id: `${data.id}`,
    title: data.title,
    plot: data.overview,
    poster_path: poster_url,
    backdrop_path: backdrop_url
  }
}