<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="editUser.currentUser"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="editUser.editName"
          :rules="[{ required: true, message: `请填写${editUser.editName}` }]"
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
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user";
import {getCurrentUserState} from "../states/user";

const router = useRouter()
const route = useRoute()
const editUser = ref({
  editKey: route.query.editKey,
  editName: route.query.editName,
  currentUser: route.query.currentValue,
})



const onSubmit = async (values) => {
//todo 提交到后台 editKey editName currentUser
  const currentUser = await getCurrentUser();
  if(!currentUser){
    showFailToast("用户没登录");
    return;
  }

  const res = await myAxios.post("/user/update", {
    "id" : currentUser.id,
    [editUser.value.editKey as string]: editUser.value.currentUser
  })

  if(res.data > 0 ){
    showSuccessToast('修改成功');
    router.back();
  }
  else{
    showFailToast('修改失败');

  }
};


</script>

<style scoped>
</style>
