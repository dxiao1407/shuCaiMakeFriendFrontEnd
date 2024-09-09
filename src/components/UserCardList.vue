<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="(user, index) in props.userList">
    <van-card
        :key="index"
        :tag="user.userRole === 0 ? '' : 'VIP'"
        :desc="user.profile"
        :title="`${user.userName}#${user.planetCode}`"
        :thumb="user.avatarUrl ? user.avatarUrl : FALLBACK_LOGO"
    >
      <!-- tags 插槽 -->
      <template #tags>
        <van-tag plain type="primary" v-for="(tag, idx) in user.tags" :key="idx"
                 style="margin-right: 6px;margin-top: 6px">
          {{ tag }}
        </van-tag>
      </template>

      <!-- footer 插槽 -->
      <template #footer>
        <van-button size="mini" @click="onChat(user.id)" :user="user">CallMe</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {FALLBACK_LOGO} from "../constant";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
//props传值
interface UserCardListProps {
  loading:Boolean
  userList: UserType[];
}
// 接收来自父组件的 props
//@ts-ignore
// const props = defineProps<UserCardListProps>();
//@ts-ignore
const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
});
const onChat = (userId : number) => {
  router.push({
    path: '/user/chat',
    query: {
      // user: JSON.stringify(user),
      id:userId
    },
  });
};


</script>

<style scoped>

</style>