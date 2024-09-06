<template>
  <div id="teamPage">
    <van-search v-model="searchText" @search="onSearch" placeholder="请输入搜索队伍关键词"/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public"></van-tab>
      <van-tab title="加密" name="secret"></van-tab>
    </van-tabs>
    <div style="margin-bottom: 8px"/>
    <van-button class="add-button" type="primary" icon="plus" @click="addTeam()"/>
    <team-card-list :team-list="teamList"></team-card-list>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import TeamCardList from "../../components/TeamCardList.vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";

const router = useRouter();
const teamList = ref([]);
const searchText = ref('');
//页面渲染完之后加载的，只加载一次
onMounted(() => {
  listTeam('');
})
const active = ref('public')
//跳转到加入队伍页面
const addTeam = () => {
  router.push({
    path: "/team/add"
  })
}
/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  //查公开
  if (name === 'public') {
    listTeam(searchText.value, 0)
  } else {
    //查加密
    listTeam(searchText.value, 2)
  }
}
/**
 * 搜索队伍
 * @param val  搜索关键词
 * @param status  队伍状态
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', teamState = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      teamState
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  }
  else if(res?.code === 40001){
    teamList.value = [];
    showFailToast("暂无队伍信息，你先创建一个吧~~");
  }
  else {
    showFailToast("加载队伍失败，请刷新");
  }
}

const onSearch = (val) => {
  listTeam(val);
}
</script>

<style scoped>

</style>