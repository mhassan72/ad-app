<script setup lang="ts">
import '@/assets/main.css';
import { onMounted } from 'vue';
import { 
  api_result, 
  api_search_term, 
  base_image_url,
  generateTitle 
} from '@/stores/title_model'
import {  truncate } from '@/helpers/shared_helper'
import { autoGenerate }  from '@/api/tmdb'
import { listTitles } from '@/model/title'
// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>
<template>
<div class="results">
    <input type="search"  v-model="api_search_term" />
    <button @click="autoGenerate">  search </button>
    {{ api_search_term }} -

    <br />

    <strong>Results</strong>

    <ul class="listTitles">
        <li 
        v-for="title in api_result" 
        :key="title.id"
        class="title"
        >
        <div class="thumbnail" :style="{  'background-image': `url(${base_image_url + title.poster_path})`}"></div>  
        <p class="item_title">{{ truncate(title.title, 23) }}</p>
        <button @click="generateTitle(title)"> Generate </button>
        </li>
    </ul>
</div>
</template>