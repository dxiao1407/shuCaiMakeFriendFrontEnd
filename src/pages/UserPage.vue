<template>
  <van-cell title="昵称" to="/user/edit" is-link :value="user.userName"/>
  <van-cell title="账号" :value="user.userAccount"/>
  <van-cell title="头像" to="/user/edit" is-link>
    <van-image
        width="50"
        :src="user.avatarUrl"
    />
  </van-cell>
  <van-cell title="性别" to="/user/edit" is-link :value="user.gender" @click="toEdit('gender','性别',user.gender)"/>
  <van-cell title="邮箱" to="/user/edit" is-link :value="user.email"/>
  <van-cell title="电话" to="/user/edit" is-link :value="user.phone"/>
  <van-cell title="基地编号" :value="user.planentCode"/>
  <van-cell title="注册时间" :value="user.createTime.toISOString()"/>


</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const user = {
  id: 1,
  userName: '火爆番茄炒蛋',
  userAccount: "useradmin",
  avatarUrl: "https://img2.baidu.com/it/u=3452879085,3831791135&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400",
  email: "123123123@qq.com",
  gender: "男",
  phone: "1234567890",
  planentCode: "123",
  createTime: new Date(),
};
const router = useRouter();
const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    params: {},
    query: {
      editKey,
      editName,
      currentValue,
    }
  })

}
</script>

<style scoped>

</style>