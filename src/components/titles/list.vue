<script setup lang="ts">
import '@/assets/main.css';
import { onMounted } from 'vue';
import { titlesList } from '@/stores/title_model'
import {  truncate } from '@/helpers/shared_helper'
import { listTitles, deleteTitle } from '@/model/title'
// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>
<template>
    <ul class="listTitles">
        <li 
          v-for="title in titlesList" 
          :key="title.id"
          class="title"
          >
          <div class="thumbnail" :style="{  'background-image': `url(${title.poster_path})`}"></div>
          <p class="item_title">{{ title.title }}</p>
          <button @click="deleteTitle(title.id)">  Delete </button>
        </li>
      </ul>
</template>