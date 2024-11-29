import { titlesList, newTitle } from '../stores/title_model'
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
    })
}

export async function deleteTitle(id: string) {
  return await client.models.Titles.delete({id: id}).finally(() => listTitles())
}
