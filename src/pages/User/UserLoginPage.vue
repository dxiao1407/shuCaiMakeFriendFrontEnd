<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="测试账号名：shucai666"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="测试账号密码：12345678"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>


</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from "../../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();
const userAccount = ref('');
const userPassword = ref('');
const onSubmit = async () => {

  const res = await myAxios.post("/user/login", {
    userAccount: userAccount.value,
    userPassword: userPassword.value
  })
  console.log("res",res)
  if(res.code === 0 && res.data){
    showSuccessToast("登录成功");
    // router.replace("/");//和push不同的是，它可以覆盖这个路径，如果回退的话，就不会回到登录页面，而是回到登录之前的页面
    //这里是路由上带的参数
    // router.back()
    const redirectUrl = route.query?.redirect as String  ;
    // console.log("redicerUrl",redirectUrl)
    window.location.href = redirectUrl;
  }
  else{
    showFailToast("登录失败");
  }
};
onMounted(()=>{
  showFailToast("当前未登录，请先登录")

})

</script>

<style scoped>
</style>
