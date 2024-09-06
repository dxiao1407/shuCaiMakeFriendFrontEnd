<template>
  <van-nav-bar :title="title" left-text="" left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view></router-view>

  </div>

  <!--  <slot name="content">-->
  <!--  </slot>-->

  <van-tabbar route >
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import routes from "../config/route";


const DEFAULT_TITLE = '车友匹配'
const router = useRouter()
const title = ref(DEFAULT_TITLE)
/**
 * 根据路由切换标题
 */
//获取要跳转的路径
router.beforeEach((to, from) => {
  const toPath = to.path;
  //从route路由中寻找相同的路径的对象，返回那一条数据
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  //设置当前标题为当前路由设置的name，如果为空则为默认值
  title.value = route?.name ?? DEFAULT_TITLE;
})

const onClickLeft = () => {
  router.back()
};
const onClickRight = () => {
  router.push({path: '/search'})
};
</script>

<style scoped>
#content {
  padding-bottom: 50px;
}

</style>