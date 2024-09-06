<template>
  <div id = "teamPage">
    <van-search v-model="searchText" @search="onSearch" placeholder="请输入搜索队伍关键词" />
    <team-card-list :team-list="teamList" :loading="loading"></team-card-list>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>

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
const searchText = ref('');
const loading = ref(true)
//页面渲染完之后加载的，只加载一次
onMounted( ()=>{
   listTeam('');
})

const listTeam = async (val) =>{
  const res = await myAxios.get("/team/list/my/join",{
    params:{
      searchText:val
    }
  });
  if(res?.code === 0 ){
    teamList.value = res.data;
    loading.value = false
    // showSuccessToast("加载队伍成功");
  }else{
    showFailToast("加载队伍失败，请刷新");
  }
}

const onSearch =  (val) => {
   listTeam(val);
}
</script>

<style scoped>

</style>