// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Titles from '@/modules/Titles.vue'; // Adjust the path as needed
import ShowTitle from '@/modules/titles/show.vue'

const routes = [
  {
    path: '/titles',
    name: 'Titles',
    component: Titles,
  },
  {
    path:'/titles/:list_type/:title_id',
    name: 'ShowTitles',
    component: ShowTitle,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
