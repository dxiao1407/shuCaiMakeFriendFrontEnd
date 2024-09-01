import Index from "../pages/Index.vue";
import Team from "../pages/Team/TeamPage.vue";
import User from "../pages/User/UserPage.vue";
import SearchPage from "../pages/User/SearchPage.vue";
import UserEditPage from "../pages/User/UserEditPage.vue";
import SearchResultPage from "../pages/User/SearchResultPage.vue";
import UserLoginPage from "../pages/User/UserLoginPage.vue";
import TeamAddPage from "../pages/Team/TeamAddPage.vue";


const routes = [
    { path: '/', component: Index },
    { path: '/team', component: Team },
    { path: '/team/add', component: TeamAddPage },
    { path: '/user', component: User },
    { path: '/user/edit', component: UserEditPage },
    { path: '/search', component: SearchPage },
    { path: '/user/list', component: SearchResultPage },
    { path: '/user/login', component: UserLoginPage },

]
export default routes;