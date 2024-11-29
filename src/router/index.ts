// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Titles from '@/modules/Titles.vue'; // Adjust the path as needed

const routes = [
  {
    path: '/titles',
    name: 'Titles',
    component: Titles,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
