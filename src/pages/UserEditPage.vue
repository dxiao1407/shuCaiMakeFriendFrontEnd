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
import {useRoute} from "vue-router";
import {ref} from "vue";

const route = useRoute()
const editUser = ref({
  editKey:route.query.editKey,
  editName:route.query.editName,
  currentUser:route.query.currentUser,
})

const onSubmit = (values) => {
//todo 提交到后台 editKey editName currentUser
  console.log('submit', values);
};


</script>

<style scoped>
</style>
