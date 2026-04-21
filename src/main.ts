import { createApp } from "vue";
import "./styles/mug.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { useBeverageStore } from "./stores/beverageStore";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

async function startApp() {
  app.use(pinia);

  const beverageStore = useBeverageStore(pinia);
  await beverageStore.init();

  app.mount("#app");
}

startApp();