<script setup lang="ts">
import '@/assets/main.css';
import { onMounted } from 'vue';
import TitleNew from '@/components/titles/new.vue'
import TitleSearch from '@/components/titles/results.vue'
import TitleList from '@/components/titles/list.vue'
import { listTitles } from '@/model/title'
import { titleStage } from '@/stores/title_model'
// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>

<template>
  <main>    
    <TitleNew v-if="titleStage.forum"  />
    <hr />
    <TitleSearch v-if="titleStage.search_bar" />
    <hr />
    <TitleList v-if="titleStage.title_list" />

  </main>
</template>
