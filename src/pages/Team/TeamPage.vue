<template>
  <div id = "teamPage">
    <team-card-list :team-list="teamList"></team-card-list>
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

//页面渲染完之后加载的，只加载一次
onMounted(async ()=>{
  const res = await myAxios.get("/team/list");
  if(res?.code === 0 ){
    teamList.value = res.data;
    showSuccessToast("加载队伍成功");
  }else{
    showFailToast("加载队伍失败，请刷新");
  }
})
</script>

<style scoped>

</style>