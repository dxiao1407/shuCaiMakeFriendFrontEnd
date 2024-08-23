import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router";
import routes from "./config/route";

const app =createApp(App);
// app.use(NavBar);
// app.use(Button);
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),//哈希模式，路由有#
    routes,
})

app.use(router);
app.mount('#app');
