<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// Reactive reference to store the array of titles
const titlesList : any   = ref<Array<Schema['Titles']>>([]);
const newTitle  =   ref({
  id: '',
  title: '',
  plot: ''
})

function listTitles() {
  client.models.Titles.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      titlesList.value = items;
    },
  });
}

function createTitle() {
    client.models.Titles.create(newTitle.value).then(() => {
      // After creating a new title, update the list of titles
      listTitles();
      newTitle.value = {id: '',title: '',plot: ''}
    })
}

async function deleteTitle(id: string) {
  return await client.models.Titles.delete({id: id}).finally(() => listTitles())
}

// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>

<template>
  <main>
    <h1>My Titles</h1>
    <div class="newTitle">

      <div class="field">
        <label for="title_id">ID :</label>
        <input type="text" id="title_id" v-model="newTitle.id">
        <button>Find</button>
      </div>

      <div class="field">
        <label for="title">Title :</label>
        <input type="text" id="title" v-model="newTitle.title">
      </div>
      
      <div class="field">
        <label for="plot">Plot :</label>
        <textarea name="" id="plot" v-model="newTitle.plot"></textarea>
      </div>

      <div class="action">
        <button @click="createTitle">+ Add</button>
      </div>
    </div>

    <ul>
      <li 
        v-for="title in titlesList" 
        :key="title.id"
        >

        {{ title.id }} - 
        {{ title.title }} - 
        {{ title.plot }} 

        <button @click="deleteTitle(title.id)">  Delete </button>
      </li>
    </ul>
  </main>
</template>
