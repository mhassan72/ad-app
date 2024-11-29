<script setup lang="ts">
import '@/assets/main.css';
import { onMounted } from 'vue';
import { newTitle } from '../../stores/title_model'
import { listTitles, createTitle  } from '../../model/title'
// Fetch titles when the component is mounted
onMounted(() => {
  listTitles();
});
</script>

<template>
    <div class="newTitle">
      <h3>NEW Title Component</h3>
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
</template>
