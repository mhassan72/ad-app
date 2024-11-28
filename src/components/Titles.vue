<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import axios from 'axios';


const client = generateClient<Schema>();

// Reactive reference to store the array of titles
const titlesList : any = ref<Array<Schema['Titles']>>([]);
const newTitle = ref({id: '',title: '',plot: '', poster_path:  '',  backdrop_path: ''})
const api_result : any = ref([])
const api_search_term : any = ref('')
const base_image_url = "https://image.tmdb.org/t/p/w500"

async function generateTitle (data: any) {
  let poster_url = ''
  let backdrop_url = ''

  if(data.poster_path)  poster_url  = `${base_image_url +  data.poster_path}`
  if(data.backdrop_path)  backdrop_url  = `${base_image_url +  data.backdrop_path}`


  newTitle.value = {
    id: `${data.id}`,
    title: data.title,
    plot: data.overview,
    poster_path: poster_url,
    backdrop_path: backdrop_url
  }
}

function autoGenerate () {

  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/search/movie?query=${api_search_term.value}&include_adult=false&language=en-US&page=1`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzliYmI2ZDkyZjVmNjI3NWI5M2Y4N2EzYmNlZTE4YSIsIm5iZiI6MTczMjc2NjcyMS4yMDQ4NzE0LCJzdWIiOiI2NzQ3ZWE2NmNhYjBhMjM4ZGRkY2UyNzgiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nmqpxOV7MOefEyenk7YYYc64FA2-c_rY3M7CS-f15z0'
    }
  };
  axios.request(options)
  .then((res: any) => api_result.value  = res.data.results)
  .catch((err : any)=> console.error(err));
}

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
      newTitle.value = {id: '',title: '',plot: '', poster_path:  '',  backdrop_path: ''}
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

      <h3>NEW Title</h3>

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

    <div class="results">
      <input type="search"  v-model="api_search_term" />
      <button @click="autoGenerate">  search </button>
      {{ api_search_term }} -
      <!-- {{ api_result }} -->
      <!-- {{  newTitle }} -->

      <br />

      <strong>Results</strong>

      <ul class="listTitles">
        <li 
          v-for="title in api_result" 
          :key="title.id"
          class="title"
          >
          <div class="thumbnail" :style="{  'background-image': `url(${base_image_url + title.poster_path})`}"></div>  
          {{ title.title }}
          <button @click="generateTitle(title)"> Generate </button>
        </li>
      </ul>

      <!-- <li 
        v-for="title in api_result" 
        :key="title.id"
        >

        {{ title.id }} - 
        {{ title.title }} - 
        {{ title.overview }} 
        {{ title }} 

        <div class="thumbnail">
          <img  :src="`${base_image_url + title.poster_path}`" />
        </div>

        
        <img  :src="`https://image.tmdb.org/t/p/w500${title.backdrop_path}`" />


        <button @click="generateTitle(title)"> Generate </button>
      </li> -->
    </div>

    <ul class="listTitles">
      <li 
        v-for="title in titlesList" 
        :key="title.id"
        class="title"
        >

        <div class="thumbnail" :style="{  'background-image': `url(${title.poster_path})`}"></div>

        {{ title.title }}

        <!-- <button @click="deleteTitle(title.id)">  Delete </button> -->
      </li>
    </ul>
  </main>
</template>
