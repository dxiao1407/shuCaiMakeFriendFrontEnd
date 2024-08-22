<template>
  <van-nav-bar title="标题" left-text="" left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight">
    <template #right>
      <van-icon name="search" size="18"/>
    </template>
  </van-nav-bar>

  <slot name="content">
    <template v-if="active === 'index'">
      <Index></Index>
    </template>
    <template v-if="active === 'team'">
      <Team></Team>
    </template>


  </slot>

  <van-tabbar v-model="active" @change="onChange">
    <van-tabbar-item icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {ref} from 'vue';
import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";

const active = ref("index");


const onClickLeft = () => showToast('1');
const onClickRight = () => showToast('2');
const onChange = (index) => showToast(`标签 ${index}`);
</script>

<style scoped>

</style>