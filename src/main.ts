import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import router from './router'; // Import the router
import { createPinia } from 'pinia';

Amplify.configure(outputs);
const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // Use Pinia
app.use(router); // Use Vue Router
app.mount('#app');
