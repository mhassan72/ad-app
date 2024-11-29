import { titlesList, newTitle, titleStage } from '../stores/title_model'
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export function listTitles() {
  client.models.Titles.observeQuery().subscribe({
    next: ({ items }) => {
      titlesList.value = items;
    },
  });
}

export function createTitle() {
    client.models.Titles.create(newTitle.value).then(() => {
      // After creating a new title, update the list of titles
      listTitles();
      newTitle.value = {id: '',title: '',plot: '', poster_path:  '',  backdrop_path: ''}
      titleStage.value.search_results  = false
      titleStage.value.forum = false
      titleStage.value.search_bar =  true
      titleStage.value.title_list = true
    })
}

export async function deleteTitle(id: string) {
  return await client.models.Titles.delete({id: id}).finally(() => listTitles())
}
