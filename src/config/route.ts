import Index from "../pages/User/Index.vue";
import TeamPage from "../pages/Team/TeamPage.vue";
import TeamAddPage from "../pages/Team/TeamAddPage.vue";
import TeamUpdatePage from "../pages/Team/TeamUpdatePage.vue";
import UserPage from "../pages/User/UserPage.vue";
import UserEditPage from "../pages/User/UserEditPage.vue";
import UserUpdatePage from "../pages/User/UserUpdatePage.vue";
import SearchPage from "../pages/User/SearchPage.vue";
import SearchResultPage from "../pages/User/SearchResultPage.vue";
import UserLoginPage from "../pages/User/UserLoginPage.vue";
import UserTeamCreatePage from "../pages/Team/UserTeamCreatePage.vue";
import UserTeamJoinPage from "../pages/Team/UserTeamJoinPage.vue";
import UserWebsocket from "../pages/User/UserWebsocket.vue";
import UserChatList from "../pages/User/UserChatList.vue";


const routes = [
    { path: '/', component: Index },
    { path: '/team',name:"找队伍", component: TeamPage },
    { path: '/team/add',name:"新增队伍", component: TeamAddPage },
    { path: '/team/update',name:"修改队伍", component: TeamUpdatePage },
    { path: '/user',name:"个人信息", component: UserPage },
    { path: '/user/edit',name:"编辑信息", component: UserEditPage },
    { path: '/user/update',name:"当前信息", component: UserUpdatePage },
    { path: '/search',name:"找骑友", component: SearchPage },
    { path: '/user/list',name:"骑友列表", component: SearchResultPage },
    { path: '/user/login',name:"登录", component: UserLoginPage },
    { path: '/user/team/create',name:"创建队伍", component: UserTeamCreatePage },
    { path: '/user/team/join',name:"加入队伍", component: UserTeamJoinPage },
    { path: '/user/chat',name:"骑友对话", component: UserWebsocket },
    { path: '/user/chat-list',name:"消息列表", component: UserChatList },


]
export default routes;