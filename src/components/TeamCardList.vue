<template>
  <div id='teamCardList'>
    <!--    todo 当前人数展示  -->
    <van-card
        v-for="(team, index) in props.teamList"
        :key="index"
        :tag="teamStatusEnum[team.teamState]"
        :thumb="FALLBACK_LOGO"
        :desc="team.description"
        :title="`${team.teamName}#当前人数:${userLengths[index]}`"
    >
      <!-- tags 插槽 -->
      <template #bottom>
        <div>{{ '最大人数:' + team.maxNum }}</div>
        <div>{{ '创建时间:' + formatDate(team.createTime) }}</div>
        <div v-if="team.expireTime">{{ '过期时间:' + formatDate(team.expireTime) }}</div>
      </template>
      <template #tags>
        <van-tag plain type="primary" style="margin-right: 6px;margin-top: 6px">
          队长：{{ team.userVoList.userName }}
        </van-tag>
      </template>
      <!-- footer 插槽 -->
      <template #footer>
        <van-button v-if="team.userVoList.id === currentUser.id" size="small" type="success" plain @click="doUpdateTeam(team.id,userLengths[index])">更新队伍</van-button>
        <van-button size="small" type="danger" v-if="team.userVoList.id === currentUser.id" plain @click="doDeleteTeam(team.id)">解散队伍</van-button>
        <van-button size="small" type="primary" v-if="team.hasJoin" plain @click="doQuitTeam(team.id)">退出队伍</van-button>
        <van-button size="small" type="primary" v-if="team.userVoList.id !== currentUser.id && !team.hasJoin" plain @click="doJoinTeam(team.id)">加入队伍</van-button>
      </template>
    </van-card>
  </div>

</template>

<script setup lang="ts">
import {FALLBACK_LOGO} from "../constant";
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constant/team";
import myAxios from "../plugins/myAxios.js";
import {showFailToast, showSuccessToast} from "vant";
import {onMounted, ref, watch} from 'vue';
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";
import {UserType} from "../models/user"; // 从 vue 包中导入 reactive

//props传值
interface TeamCardListProps {
  teamList: TeamType[];
}

//@ts-ignore
const props = withDefaults(defineProps<TeamCardListProps>(), {
  loading: true,
  // @ts-ignore
  teamList: [] as TeamType[],
});
const currentUser = ref();
const router = useRouter();
/**
 * 加入队伍
 * @param id
 */
const doJoinTeam = async (id: number) => {
  const res = await myAxios.post("/team/join", {
    id: id
  })
  //@ts-ignore
  if (res?.code === 0) {
    showSuccessToast("加入成功")
  } else {
    //@ts-ignore
    showFailToast("加入失败" + (res.description ? `,${res.description}` : ''))
  }
}
const userLengths = ref([]);
/**
 * 获取队伍人数数量
 * @param teamList
 */
const getUserCountForTeams = async (teamList) => {
  const promises = teamList.map(team => {
    return myAxios.get(`/team/list/teamuser`, {params: {teamId: team.id}})
        .then(response => {
          return response.data.length;  // 假设 response.data 是用户列表
        })
        .catch(error => {
          console.error(`Failed to get user count for team ${team.id}:`, error);
          return 0; // 请求失败时返回0
        });
  });
  userLengths.value = await Promise.all(promises);
};
//确保 props.teamList 在组件挂载时已经准备好，并且在 teamList 变化时重新发起请求。
watch(() => props.teamList, (newVal) => {
  if (newVal && newVal.length > 0) {
    getUserCountForTeams(newVal);
  }
}, {immediate: true});
//组件渲染完成后执行
onMounted(async () => {
  await getUserCountForTeams(props.teamList);
  currentUser.value = await getCurrentUser()
});
/**
 * 更新队伍
 * @param id
 * @param userLengths
 */
const doUpdateTeam = (id: number,  userLengths: number) => {
  router.push({
    path: "/team/update",
    query: {
      id: id,
      userLengths: userLengths // 这里直接传递 userLengths 作为一个普通的数字值
    }
  })
}
/**
 * 删除队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post("/team/quit", {
    id: id
  })
  //@ts-ignore
  if (res?.code === 0) {
    showSuccessToast("操作成功")
  } else {
    //@ts-ignore
    showFailToast("操作失败" + (res.description ? `,${res.description}` : ''))
  }
}
/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post("/team/delete", {
    id
  })
  //@ts-ignore
  if (res?.code === 0) {
    showSuccessToast("操作成功")
  } else {
    //@ts-ignore
    showFailToast("操作失败" + (res.description ? `,${res.description}` : ''))
  }
}


// 格式化时间
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回值是 0-11 之间，所以需要加 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}年${month}月${day}日${hours}点${minutes}分`;
};

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  margin-left: -5px;
  height: 90px;
  object-fit: unset;
}
</style>