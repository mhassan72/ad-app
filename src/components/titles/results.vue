<script setup lang="ts">
import '@/assets/search_results.css';
import { onMounted } from 'vue';
import { 
  api_result, 
  api_search_term, 
  base_image_url,
  currentSearchModal
} from '@/stores/title_model'
import {  truncate } from '@/helpers/shared_helper'
import { autoGenerate }  from '@/api/tmdb'
import { listTitles } from '@/model/title'
import TitleModal from '@/components/titles/modal.vue'
// Fetch titles when the component is mounted
function setTitle (val: any) {
  currentSearchModal.value = val
  currentSearchModal.value.modal = true
}

onMounted(() => {
  listTitles();
});
</script>
<template>
<div class="search_results">
    <input type="search"  v-model="api_search_term" />
    <button @click="autoGenerate">  search </button>
    {{ api_search_term }} -
    <strong>Results</strong>

    <ul class="search_results_list">
        <li v-for="title in api_result" :key="title.id" class="title" @click="setTitle(title)">
          <div class="thumbnail" :style="{  'background-image': `url(${base_image_url + title.poster_path})`}"></div>  
          
          <div class="context">
            <div class="item_title">
              <h3>{{ truncate(title.title, 43) }}</h3>
              <p>{{ truncate(title.overview, 100) }}</p>
            </div>
          
            <div class="meta_data ">
              <div class="col start_color">
                <label v-if="title.release_date"> Released </label> <br />
                {{ title.release_date }}
              </div>
              <div class="col midle_color">
                <label v-if="title.vote_average"> Rating </label> <br />
                {{ title.vote_average.toFixed(2) }}
              </div>
              <div class="col">
                <label v-if="title.popularity"> Views </label> <br />
                {{ title.popularity }}
              </div>

            </div>
          </div>
          <!-- <button @click="generateTitle(title)"> Generate </button> -->
        </li>

        <TitleModal :data="currentSearchModal" />
    </ul>
</div>
</template>