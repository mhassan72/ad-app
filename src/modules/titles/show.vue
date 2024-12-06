<template>
    <div class="page_title">
        <!-- :key="route.params.title_id"> -->
        <HeaderNav :title="currentTitle.title" />
        <div class="title">
            <img class="avatarTitle" :src="currentTitle.poster_path" alt="">


            <div class="context">
                <p>
                    {{ currentTitle.plot }}
                </p>

                <div class="genres">
                    <span class="item" v-for="(item, index) in currentTitle.genres" :key="index">
                        {{ item }}
                    </span>
                </div>
            </div>
            
        </div>


        <div class="header">
            <label> Cast</label>
            <button @click="update()">update</button>
            <button  @click="fetchDetails(`${route.params.title_id}`)">Get Cast and Crew</button>
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


        <!-- Upload Videos -->
         <div class="video_upload" v-if="!uploadProgress">
            <label for="fileUploader">Upload</label>
            <input id="fileUploader" type="file" ref="fileInput">
            <button @click="handleUpload"> Upload file </button>
         </div>

        <!-- {{ castParsedArray }} {{ crewParsedArray }} -->
          <!-- {{ currentTitle.video  }} -->

          <video v-if="currentTitle.video" controls>
            <source :src="currentTitle.video.source_url">
          </video>

          <div class="uploadProgressBar" v-if="uploadProgress">
            <div class="progress" :style="{ 'width': `${uploaded.progress}%`}"></div>
          </div>


    </div>
</template>
<script setup lang="ts">
import '@/assets/titles/cast.css';
import { useRoute }  from 'vue-router'

import HeaderNav from '@/components/nav/top.vue'

import { getTitle, updateTitle } from '@/model/title'
import {fetchDetails, getGenres } from '@/api/tmdb'
import { newTitle, currentTitle } from '@/stores/title_model';
import { onMounted, ref } from 'vue';
import { uploadData, getUrl } from "aws-amplify/storage";

const route = useRoute()
const id : string = route.params.title_id.toString()
const fileInput = ref<HTMLInputElement | null>(null);
const uploadProgress = ref(false);
const uploaded : any = ref({
    signed_url: '',
    url_exp: '',
    progress: 0
})
const handleUpload = async () => {
    uploadProgress.value = true
  const file = fileInput.value?.files?.[0];
  if (!file) {
    console.error('No file selected');
    return;
  }

  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = async (event) => {
    const result = event.target?.result as ArrayBuffer | null;

    if (!result) {
      console.error('Failed to read file');
      return;
    }

    console.log('File read successfully:', result);

    try {
        uploadData({
            data: result,
            path: `media/video/${file.name}`,
            options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        uploaded.value.progress =  Math.round((transferredBytes / totalBytes) * 100)
                    }
                }
            }
        })

        const linkToStorageFile = await getUrl({path: `media/video/${file.name}`,})
        uploaded.value.signed_url  = linkToStorageFile.url  
        uploaded.value.url_exp = linkToStorageFile.expiresAt

        currentTitle.value.video = {
            source_url: uploaded.value.signed_url,
            url_exp: uploaded.value.url_exp ,
            file_name: file.name,
            file_path: `media/video/${file.name}`,
            progress:  uploaded.value.progress
        }

        updateTitle(currentTitle.value)
        uploadProgress.value = false
        await getTitle(id)
      
    } catch (error) {
        uploadProgress.value = false
        console.error('Error uploading file:', error);
    }

  };

  fileReader.onerror = () => {
    console.error('Error reading file:', fileReader.error);
  };
};

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
    // fetchDetails(route.params.title_id.toString())
    currentTitle.value.id = id.toString()
    currentTitle.value.cast = newTitle.value.cast
    currentTitle.value.crew = newTitle.value.crew
    updateTitle(currentTitle.value)
    .then((response) => console.log(response))

    await getTitle(id)
}

onMounted(async () => {
    await getTitle(id)
    convertToJson(currentTitle.value.crew, crewParsedArray )
    convertToJson(currentTitle.value.cast, castParsedArray )
    getGenres(id)
})
</script>
