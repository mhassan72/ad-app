<script setup lang="ts">
import '@/assets/main.css';
import { onMounted } from 'vue';
import TitleNew from '../components/titles/new.vue'
import TitleSearch from '../components/titles/results.vue'
import TitleList from '../components/titles/list.vue'
import { listTitles } from '../model/title'
// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>

<template>
  <main>
    <h1>My Titles</h1>
    
    <TitleNew />
    <hr />
    <TitleSearch />
    <hr />
    <TitleList />

  </main>
</template>
