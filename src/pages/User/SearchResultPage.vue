<template>
  <UserCardList :user-list="userList" :loading="loading"></UserCardList>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空"/>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from "vue-router";
import myAxios from "../../plugins/myAxios.js";
import qs from "qs";
import UserCardList from "../../components/UserCardList.vue";


const route = useRoute();

const {tags} = route.query;
const loading = ref(true)
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

const userList = ref([]);

onMounted(async () => {
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags,
      pageSize: 8,
      pageNumber: 1
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    }
  })
      .then(function (response) {
        // handle success
        console.log('/user/search/tags', response);
        return response.data?.records;
      })
      .catch(function (error) {
        // handle error
        console.log('/user/search/tags', error);
        showToast({
          type: 'fail',
          message: '请求失败'
        });
      })
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        //将 JSON 字符串转换为 JavaScript 对象或数组
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
    loading.value = false
  }
})


</script>

<style scoped>


</style>
