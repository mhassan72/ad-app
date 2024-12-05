<template>
    <div class="page_title">
        <h1>Title</h1>
        {{  route.params.title_id }}
        <button @click="update()">update</button>
        <button  @click="fetchDetails(`${route.params.title_id}`)">Get Cast and Crew</button>

        <div class="title">
            <h1>
                {{ currentTitle.title }}
            </h1>
            <p>
                {{ currentTitle.plot }}
            </p>
            <img class="avatarTitle" :src="currentTitle.poster_path" alt="">
        </div>


        <div class="header">
            <label> Cast</label>
        </div>

        <div class="cast">
            <div v-for="(item, index) in castParsedArray" :key="index" >
                <div  class="item" v-if="item.profile_path !='https://image.tmdb.org/t/p/w500null'">
                    <div 
                    class="avatar"
                    :style="{'background-image': `url(${item.profile_path})`}"
                >
                </div>

                <div class="context"
                    v-if="item.profile_path !='https://image.tmdb.org/t/p/w500null'"
                >
                    <p>{{ item.name }}</p>
                    <small>{{ item.role }}</small>
                </div>
                </div>
            </div>
        </div>

        <div class="header">
            <label> Crew</label>
        </div>
        <div class="cast">
            <div v-for="(item, index) in crewParsedArray" :key="index" >
                <div  
                    class="item"
                    v-if="item.profile_path !='https://image.tmdb.org/t/p/w500null'"
                >
                    <div 
                    class="avatar"
                    :style="{'background-image': `url(${item.profile_path})`}"
                >
                </div>

                <div class="context"
                    v-if="item.profile_path !='https://image.tmdb.org/t/p/w500null'"
                >
                    <p>{{ item.name }}</p>
                    <small>{{ item.role }}</small>
                </div>
                </div>
            </div>
        </div>

        <!-- {{ castParsedArray }} {{ crewParsedArray }} -->



    </div>
</template>
<script setup lang="ts">
import '@/assets/titles/cast.css';
import { useRoute }  from 'vue-router'
import { getTitle, updateTitle } from '@/model/title'
import {fetchDetails } from '@/api/tmdb'
import { newTitle, currentTitle } from '@/stores/title_model';
import { onMounted, ref } from 'vue';

const route = useRoute()
const id : string = route.params.title_id.toString()

// Parsed array of JSON objects
const castParsedArray = ref<Array<{ titleId: number; name: string; role: string; profile_path: string }>>([]);
const crewParsedArray = ref<Array<{ titleId: number; name: string; role: string; profile_path: string }>>([]);
// Function to convert raw strings to JSON objects

async function convertToJson(arrayVal: any, model: any) {
  try {
    model.value = arrayVal.map((item: any) => {
      // Remove curly braces and split by comma
      const properties = item.replace(/[{}]/g, '').split(', ');
      // Construct the object by splitting key-value pairs
      const obj: Record<string, string> = {};
      properties.forEach((prop: any) => {
        const [key, value] = prop.split('=');
        obj[key] = value;
      });

      // Return the object with correct typing
      return {
        titleId: parseInt(obj.titleId, 10),
        name: obj.name,
        role: obj.role,
        profile_path: obj.profile_path,
      };
    });

    console.log('Converted JSON Objects:', castParsedArray.value);
  } catch (error) {
    console.error('Error converting to JSON objects:', error);
  }
}


async function update ()  {
    currentTitle.value.id = id.toString()
    currentTitle.value.cast = newTitle.value.cast
    currentTitle.value.crew = newTitle.value.crew
    updateTitle(currentTitle.value)
    .then((response) => console.log(response))
}

onMounted(async () => {
    await getTitle(id)
    convertToJson(currentTitle.value.crew, crewParsedArray )
    convertToJson(currentTitle.value.cast, castParsedArray )
})
</script>
