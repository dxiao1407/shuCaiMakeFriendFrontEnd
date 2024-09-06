<template>
  <div id="teamPage">
    <van-search v-model="searchText" @search="onSearch" placeholder="请输入搜索队伍关键词"/>
    <van-skeleton
        v-for="n in 5"
        :key="n"
        title
        avatar
        :row="3"
        :loading="loadingOut"
    />
    <team-card-list :team-list="teamList" :loading="loading"></team-card-list>
    <van-empty v-if="isShowEmpty" description="数据为空"/>

  </div>

</template>

<script setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import TeamCardList from "../../components/TeamCardList.vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast} from "vant";

const router = useRouter();
const teamList = ref([]);
const loading = ref(true)
const loadingOut =ref(true)
const searchText = ref('');
const isShowEmpty = ref(false)
//页面渲染完之后加载的，只加载一次
onMounted(() => {
  listTeam('');
})
const listTeam = async (val) => {
  const res = await myAxios.get("/team/list/my", {
    params: {
      searchText: val
    }
  });
  if (res?.code === 0) {
    teamList.value = res.data;
    // showSuccessToast("加载队伍成功");
    loading.value = false
    loadingOut.value = false
  }
  else if(res?.code === 40001){
    loading.value = false
    loadingOut.value = false
    isShowEmpty.value= true
  }
  else {
    loading.value = false
    loadingOut.value = false
    isShowEmpty.value = true
    showFailToast("加载队伍失败，请刷新");
  }

}

const onSearch = (val) => {
  listTeam(val);
}
</script>

<style scoped>

</style>