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
// import {fetchDetails } from '@/api/tmdb'
import TMDBService from '@/services/tmdb'
import { modelDetails } from '@/stores/search'

const props = defineProps<{ data: any }>();

currentSearchModal.value = props.data

function closeModal () {
    modelDetails.value.settings.modal = false
}

async function fetchDetails (titleId: string, titleType: "movie" | "tv" = "movie") {
    console.log(titleId, titleType)
    try {
        modelDetails.value.data = await TMDBService.fetchDetails(titleId, titleType);
        console.log("Fetched details for the title successfully!", currentSearchModal.value);
    } catch (error) {
        console.error("Failed to fetch details for the title:", error);
    }
}

function generate () {
    generateTitle(modelDetails.value.data)
    closeModal()
    titleStage.value.search_results  = false
    titleStage.value.search_bar =  true
    titleStage.value.forum = true
    titleStage.value.title_list = false
}

</script>

<template>
<!-- <div class="modal" :key="data.id" v-if="currentSearchModal.modal"> -->
<div class="modal" key="data.id" v-if="modelDetails.settings.modal">
    <button class="btn-close" @click="closeModal">Close</button>
    
    <div class="cover" :style="{  'background-image': `url(${data.backdrop_path})`}" >
        <div class="black_fill"></div>
    </div>

    <div class="header">
        <div class="poster"  :style="{  'background-image': `url(${data.poster_path})`}"></div>
        <div class="context">
            <div class="content_title">
                <h4>{{ data.title }}</h4>
            </div>
            <div class="content_original_title">
                {{ modelDetails.data }}
                {{ data.year }}
                <br />
                adult:{{ data.adult }}
                original_name: {{ data.original_name }} | {{ data.original_language }}
                origin_country:{{ data.origin_country }}
                popularity:{{ data.popularity }}
                vote_average:{{ data.vote_average }}
                vote_count:{{ data.vote_count }}

                <!-- {{ currentSearchModal }} -->
            </div>
        </div>
    </div>

    <div class="content_plot">
        {{  data.plot }}
    </div>

    <button  @click="fetchDetails(data.id, data.list_type)">Get Details</button>



    <!-- <h1>Modal</h1>
    {{  modal_open  }}
    {{ data.id }}
    {{ currentSearchModal.id }}

    {{  data  }} -->

    {{ newTitle.crew }}

    <button @click="generate"> Generate </button>

</div>
</template>