<template>
  <template v-if="user">
    <van-cell title="昵称" to="/user/edit" is-link :value="user.userName"
              @click="toEdit('userName','昵称',user.userName)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像" is-link @click="triggerUpload">
      <van-image
          width="50"
          :src="user.avatarUrl ? user.avatarUrl : FALLBACK_LOGO"
      />
      <!-- 隐藏的上传组件，用于处理文件上传 -->
      <van-uploader
          ref="uploaderRef"
          :after-read="handleUpload"
          :max-count="1"
          accept="image/*"
          style="display: none"
      />
    </van-cell>
    <van-cell title="性别" to="/user/edit" is-link :value="user.gender ==1 ? '男':'女'"
              @click="toEdit('gender','性别',user.gender ==1 ? '男':'女')"/>
    <van-cell title="邮箱" to="/user/edit" is-link :value="user.email"
              @click="toEdit('email','邮箱',user.email)"/>
    <van-cell title="电话" to="/user/edit" is-link :value="user.phone"
              @click="toEdit('phone','电话',user.phone)"/>
    <van-cell title="基地编号" :value="user.planetCode"/>
    <van-cell title="注册时间" :value="formatDate(user.createTime)"/>
  </template>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, nextTick,ref} from "vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../../services/user";
import {FALLBACK_LOGO} from "../../constant";
import {formatDate} from "../../utils/utils";

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
const uploaderRef = ref(null); // 用于引用 van-uploader 组件

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
const triggerUpload = async () => {
    uploaderRef.value.chooseFile(); // 调用 van-uploader 组件的选择文件功能
};
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file.file); // 将文件添加到 FormData 对象中
  formData.append('avatarsUrl', 'user');  // 动态传入 'avatarsUrl'，可以是 'user' 或 'team'
  try {
    // 使用 axios 发送 POST 请求上传文件
    const res = await myAxios.post('/cos/upload', formData);
    if (res.code === 0) {
      // 上传成功后，更新用户头像
      showSuccessToast('头像上传成功！')
      user.value = await getCurrentUser();
    } else {
      showFailToast('上传失败: ' + data.message)
    }
  } catch (error) {
    console.error('上传头像时发生错误：', error);
    showFailToast('上传失败，请重试')
  }
};

</script>

<style scoped>

</style>