<script setup lang="ts">
import '@/assets/new_title.css';
import { onMounted, ref } from 'vue';
import { newTitle } from '../../stores/title_model'
import { modelDetails } from '../../stores/search'
import { listTitles, createTitle  } from '../../model/title'
// Fetch titles when the component is mounted
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()

const option = ref('')

function create () {
  let id : any = 0
  try {
    id = createTitle()
  } catch {
    console.log("error while adding this Title")
  }
  finally {
    // console.log("Finished adding details for this Title", id)
    router.push(`/titles/${modelDetails.value.data.list_type}/${id.toString()}`)
  }
}
onMounted(() => {
  listTitles();
});
</script>

<template>
    <div class="newTitle">
    <h1>New Title</h1>

      <div class="field">
        <!-- <label for="title_id">ID </label> -->
        <input type="text" id="title_id" v-model="modelDetails.data.id">
      </div>

      <div class="field">
        <!-- <label for="title">Title</label> -->
        <input type="text" id="title" v-model="modelDetails.data.title">
      </div>

      <div class="field">
        <!-- <label for="list_type">List Type</label> -->

        <select name="" id="list_type" v-model="modelDetails.data.list_type">
          <option  selected>Select Listing type</option>
          <option value="movie" >Movie</option>
          <option value="tv show">Tv Show</option>
          <option value="documentary">Documentary</option>
        </select>


        <!-- <label for="title">Title :</label>
        <input type="text" id="title" v-model="newTitle.title"> -->
      </div>
      
      <div class="field">
        <!-- <label for="plot">Plot</label> -->
        <textarea name="" id="plot" v-model="modelDetails.data.plot"></textarea>
      </div>

      <div class="action">
        <button class="btn" @click="create"> Save and Continue > </button>
      </div>
    </div>
</template>
