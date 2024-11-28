<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

// Reactive reference to store the array of titles
const titles = ref<Array<Schema['Title']>>([]);

function listTitles() {
  client.models.Title.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      titles.value = items;
    },
  });
}

function createTitle() {
  const titleName = window.prompt("Enter title name:");
  if (titleName) {
    client.models.Title.create({
      name: titleName, // Adjust field name based on the schema
    }).then(() => {
      // After creating a new title, update the list of titles
      listTitles();
    });
  }
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
        v-for="title in titles" 
        :key="title.id">
        {{ title.name }}
      </li>
    </ul>
    <div>
      🥳 App successfully hosted. Try creating a new title.
      <br />
      <a href="https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/">
        Review next steps of this tutorial.
      </a>
    </div>
  </main>
</template>
