import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7000", // 👈 backend port
});

export default api;
import { createApp } from "vue";
import App from "./App.vue";
import router from "./components/Router";

createApp(App).use(router).mount("#app");

