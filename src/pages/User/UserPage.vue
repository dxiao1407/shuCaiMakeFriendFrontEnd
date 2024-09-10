<template>
  <template v-if="user">
    <van-cell-group>
      <van-cell title="个人昵称" :value="user?.userName" />
      <van-cell title="消息" is-link to="/user/chat-list" />
      <van-cell title="修改信息" is-link to="/user/update" />
      <van-cell title="我加入的队伍" is-link to="/user/team/join" />
      <van-cell title="我创建的队伍" is-link to="/user/team/create" />
    </van-cell-group>

  </template>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../../services/user";
import {FALLBACK_LOGO} from "../../constant";

const mockUser = {
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
onMounted(async () => {
  user.value = await getCurrentUser();

})

const user = ref();
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