<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// Reactive reference to store the array of titles
const titlesList : any   = ref<Array<Schema['Titles']>>([]);
const newTitle  =   ref({
  id: '43j5bn34kj5g3jh4534593847234kl13n',
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
    client.models.Titles.create({
      id: newTitle.value.id,
      title: newTitle.value.title, // Adjust field name based on the schema
      plot: newTitle.value.plot,
    }).then(() => {
      // After creating a new title, update the list of titles
      listTitles();
      newTitle.value = {
        id: '',
        title: '',
        plot: ''
      }
    });
}

// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>

<template>
  <main>
    <h1>My Titles</h1>
    <button @click="createTitle">+ New Title</button>
    <ul>
      <li 
        v-for="title in titlesList" 
        :key="title.id"
        >

        {{ title.id }} - 
        {{ title.title }} - 
        {{ title.plot }} 
      </li>
    </ul>

    <div class="newTitle">
      <div class="field">
        <label for="title">Title :</label>
        <input type="text" id="title" v-model="newTitle.title">
      </div>
      
      <div class="field">
        <label for="plot">Plot :</label>
        <input type="text" id="plot" v-model="newTitle.plot">
      </div>

      <div class="action">
        <button @click="createTitle()">Add </button>
      </div>
    </div>

    <div>
      🥳 App successfully hosted. Try creating a new title.
      <br />
      <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
        Review next steps of this tutorial.
      </a>
    </div>
  </main>
</template>
