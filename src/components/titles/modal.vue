<script setup lang="ts">
import '@/assets/titles/modal.css';
import { defineProps } from 'vue'
import { 
    base_image_url, 
    currentSearchModal, 
    generateTitle, 
    titleStage,
    newTitle
} from '@/stores/title_model'
import {fetchDetails } from '@/api/tmdb'

const props = defineProps<{ data: any }>();

currentSearchModal.value = props.data

function closeModal () {
    currentSearchModal.value.modal = false
}

function generate () {
    generateTitle(currentSearchModal.value)
    closeModal()
    titleStage.value.search_results  = false
    titleStage.value.search_bar =  true
    titleStage.value.forum = true
    titleStage.value.title_list = false
}

</script>

<template>
<div class="modal" :key="data.id" v-if="currentSearchModal.modal">
    <button class="btn-close" @click="closeModal">Close</button>
    
    <div class="cover" :style="{  'background-image': `url(${base_image_url + data.backdrop_path})`}" >
        <div class="black_fill"></div>
    </div>

    <div class="header">
        <div class="poster"  :style="{  'background-image': `url(${base_image_url + data.poster_path})`}"></div>
        <div class="context">
            <div class="content_title">
                <h4>{{ data.title }}</h4>
            </div>
            <div class="content_original_title">
                {{ data.original_title}}  <br />
                {{ data.release_date }}
            </div>
        </div>
    </div>

    <div class="content_plot">
        {{  data.overview }}
    </div>

    <button  @click="fetchDetails(data.id)">Gett Details</button>



    <!-- <h1>Modal</h1>
    {{  modal_open  }}
    {{ data.id }}
    {{ currentSearchModal.id }}

    {{  data  }} -->

    {{ newTitle.crew }}

    <button @click="generate"> Generate </button>

</div>
</template>