import { titlesList, newTitle, titleStage, currentTitle } from '../stores/title_model'
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
    client.models.Titles.create(newTitle.value)
    .then(() => {
      // After creating a new title, update the list of titles
      listTitles();

      console.log(newTitle.value)

      newTitle.value = {
        id: '',
        title: '',
        plot: '', 
        poster_path:  '',  
        backdrop_path: ''
      }
      
      titleStage.value.search_results = false
      titleStage.value.forum = false
      titleStage.value.search_bar = true
      titleStage.value.title_list = true
    })
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
