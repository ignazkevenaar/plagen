import { createApp } from "vue";
import mdiVue from "mdi-vue/v3";
import * as icons from "./data/icons";

import "./style.css";
import App from "./App.vue";

createApp(App)
  .use(mdiVue, {
    icons,
  })
  .mount("#app");
