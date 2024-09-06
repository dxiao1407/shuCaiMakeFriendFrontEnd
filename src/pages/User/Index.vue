<template>
  <van-cell center title="心动模式">
    <template #right-icon>
      <van-switch v-model="isMatchMode"/>
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading = "loading"></user-card-list>
  <!--  todo 前端拦截器统一输出日志 -->
  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import {useRoute} from "vue-router";
import myAxios from "../../plugins/myAxios.js";
import UserCardList from "../../components/UserCardList.vue";
import {showFailToast, showSuccessToast} from "vant";


const route = useRoute();
const {tags} = route.query;
const isMatchMode = ref<Boolean>(false)
const loading =ref(true);
const userList = ref([]);

const mockUser = {
  id: 1,
  userName: '火爆番茄炒蛋',
  userAccount: "useradmin",
  avatarUrl: "https://img2.baidu.com/it/u=3452879085,3831791135&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",
  email: "123123123@qq.com",
  gender: "男",
  profile: "我是小码农，嘿嘿嘿",
  phone: "1234567890",
  userRole: 1,
  tags: ["Java", "emo", "C", "初级", "emo", "初级", "emo", "初级", "emo", "初级", "emo"],
  planetCode: "123",
  createTime: new Date(),

}
const loadData = async () => {
  loading.value = true;
  let userListData;
  //如果是心动模式，执行匹配用户的接口
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num
      },
    })
        .then(function (response) {
          // handle success
          console.log('/user/match', response);
          return response?.data;
        })
        .catch(function (error) {
          // handle error
          console.log('/user/match', error);
          showFailToast("请求失败")
        })
  } else {
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNumber: 1
      },
    })
        .then(function (response) {
          // handle success
          console.log('/user/recommend', response);

          return response?.data?.records;
        })
        .catch(function (error) {
          // handle error
          console.log('/user/recommend', error);
          showFailToast("请求失败")
        })
  }

  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        //将 JSON 字符串转换为 JavaScript 对象或数组
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false
}

//监听变量的变化
watchEffect(() => {
  loadData()

})



</script>

<style scoped>


</style>
