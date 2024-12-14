<script setup lang="ts">
import '@/assets/search_results.css';
import { onMounted, reactive } from 'vue';
import { 
  api_result, 
  api_search_term, 
  base_image_url,
  currentSearchModal,
  titleStage
} from '@/stores/title_model'
import { results } from '@/stores/search'
import {  truncate } from '@/helpers/shared_helper'
import { autoGenerate }  from '@/api/tmdb'
import TMDBService from '@/services/tmdb'
import { listTitles } from '@/model/title'
import TitleModal from '@/components/titles/modal.vue'
import  { modelDetails } from '@/stores/search'

const sQuery : any  = reactive({ term: ''})

// Fetch titles when the component is mounted
function setTitle (val: any) {
  currentSearchModal.value = val
  currentSearchModal.value.modal = true

  modelDetails.value.data = val
  modelDetails.value.settings.modal = true
}

async function search () {
  await TMDBService.run(sQuery.term).finally(()=>{
    titleStage.value.search_results = true
  })
}


onMounted(() => {
  listTitles();
});
</script>
<template>
<div class="search_results">
  <label> Search for the Title in order to auto fetch...</label>
  <div class="searchform">
    <input type="search" class="search_bar" v-model="sQuery.term" />
    <!-- <button class="cbtn" @click="autoGenerate"> search </button> -->
    <button class="cbtn" @click="search"> search </button>
  </div>

  
    <strong>Search Results for  : {{ sQuery.term }} </strong>


    <ul class="search_results_list"  v-if="titleStage.search_results">
      {{ results.meta }}

      <!-- <li v-for="title in results.data" :key="title.id" class="title" @click="setTitle(title)">
        <div class="thumbnail" :style="{  'background-image': `url(${title.poster_path})`}"></div>  
        
        <div class="context">
          <div class="item_title">
            <h3>{{ title.title }}</h3>
            <p>{{ title.plot }}</p>
            {{title.list_type }}
          </div>
        
        </div>
        <button @click="generateTitle(title)"> Generate </button>
      </li> -->

        <li v-for="title in results.data" :key="title.id" class="title" @click="setTitle(title)">
          <div class="thumbnail" :style="{  'background-image': `url(${title.poster_path})`}"></div>  
          
          <div class="context">
            <div class="item_title">
              <h3>{{ title.title }} [{{ title.list_type }}]</h3>
              <p>{{ title?.plot }}</p>
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