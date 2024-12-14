import { titlesList, newTitle, titleStage, currentTitle } from '../stores/title_model'
import { modelDetails } from '@/stores/search'
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

export const client = generateClient<Schema>();

export function listTitles() {
  client.models.Titles.observeQuery().subscribe({
    next: ({ items }) => {
      titlesList.value = items;
    },
  });
}

// Create Title
export function createTitle() {
  const id = modelDetails.value.data.id
  const { modal, ...data } = modelDetails.value.data
  
  client.models.Titles.create(data)
  .then(() => {
    listTitles();    
  }).finally(() => {
    // modelDetails.value.data = {
    //   id: '',
    //   title: "",
    //   plot: "",
    //   poster_path: "",
    //   backdrop_path: "",
    //   year: "",
    //   genres: [],
    //   original_name:  "",
    //   original_language: "",
    //   origin_country: "",
    //   adult: "",
    //   popularity:  "",
    //   vote_average: "",
    //   vote_count:  "",
    //   cast: [],
    //   crew: [],
    //   list_type: 'movie', // Lowercase list_type in details
    // }
    titleStage.value.search_results = false
    titleStage.value.forum = false
    titleStage.value.search_bar = true
    titleStage.value.title_list = true
  })
  return id
}

// Get Title via ID
export async function getTitle (id: string) {
  await client.models.Titles.get({id: id,})
  .then((response: any) => {
    currentTitle.value =  response.data
  })
}

// Update Title
export async function updateTitle (data: any) {
  return await client.models.Titles.update(data)
}

// Delete Title
export async function deleteTitle(id: string) {
  return await client.models.Titles.delete({id: id}).finally(() => listTitles())
}
