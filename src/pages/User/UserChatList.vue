<template>
  <van-skeleton title avatar :row="3" :loading="loading" v-for="(user, index) in userList">
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
        <van-icon
            name="chat-o"
            :badge="user.noReadNum"
            class="floating-icon"
            size = "30px"
        />
      </template>

      <!-- footer 插槽 -->
      <template #footer>
        <van-button size="mini" @click="onChat(user.id)">CallMe</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {FALLBACK_LOGO} from "../../constant";
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast} from "vant";
import {useRouter} from "vue-router";

const userList = ref([])
const router = useRouter()
const loading = ref(true)

onMounted(async () => {
  let userListData = await myAxios.get('/messages/getList', {})
      .then(function (response) {
        // handle success
        console.log('/messages/getList', response);
        return response?.data;
      })
      .catch(function (error) {
        // handle error
        console.log('/messages/getList', error);
        showFailToast("请求失败")
      })
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        //将 JSON 字符串转换为 JavaScript 对象或数组
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  else{
  }
  loading.value = false
  userList.value = userListData
})
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
.floating-icon {
  position: absolute; /* 悬浮在 tag-item 上 */
  top: 5px; /* 距离 tag 上边缘的距离，可以根据需要调整 */
  right: 10px; /* 距离 tag 右边缘的距离，可以根据需要调整 */
  font-size: 16px; /* 图标的大小，可以根据需要调整 */
  z-index: 10; /* 确保图标在 tag 上面 */
}
</style>