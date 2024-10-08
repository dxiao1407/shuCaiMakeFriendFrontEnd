<template>
  <div id='teamCardList'>
    <van-skeleton title avatar :row="3" :loading="props.loading" v-for="(team, index) in props.teamList">
      <van-card
          :key="index"
          :tag="teamStatusEnum[team.teamState]"
          :thumb="team.teamAvatar ?? FALLBACK_LOGO"
          :desc="team.description"
          :title="`${team.teamName}#人数(${team.hasJoinNum}/${team.maxNum})`"
      >
        <template #bottom>
          <div>{{ '创建时间:' + formatDate(team.createTime) }}</div>
          <div v-if="team.expireTime">{{ '过期时间:' + formatDate(team.expireTime) }}</div>
        </template>
        <!-- tags 插槽 -->
        <template #tags>
          <van-tag plain type="primary" style="margin-right: 6px;margin-top: 6px">
            队长：{{ team.userVoList.userName }}
          </van-tag>
        </template>
        <!-- footer 插槽 -->
        <template #footer>
          <van-button v-if="team.userVoList.id === currentUser.id" size="small" type="success" plain
                      @click="doUpdateTeam(team.id,userLengths[index])">更新队伍
          </van-button>
          <van-button size="small" type="danger" v-if="team.userVoList.id === currentUser?.id" plain
                      @click="doDeleteTeam(team.id)">解散队伍
          </van-button>
          <van-button size="small" type="primary" v-if="team.userVoList.id === currentUser?.id ||team.hasJoin" plain
                      @click="doQuitTeam(team.id)">退出队伍
          </van-button>
          <van-button size="small" type="primary" v-if="team.userVoList.id !== currentUser?.id && !team.hasJoin" plain
                      @click="preJoinTeam(team)">加入队伍
          </van-button>
        </template>
      </van-card>
    </van-skeleton>

    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam"
                @cancel="onCancel">
      <van-field v-model="inputPassword" placeholder="请输入密码"/>
    </van-dialog>
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
import {formatDate} from "../utils/utils";

//props传值
interface TeamCardListProps {
  loading:Boolean

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
const showPasswordDialog = ref(false);
const inputPassword = ref('');
const joinTeamId = ref(0)
const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.teamState === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true
  }

}

/**
 * 加入队伍
 * @param id
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post("/team/join", {
    id: joinTeamId.value,
    teamPassword: inputPassword.value
  })
  //@ts-ignore
  if (res?.code === 0) {
    showSuccessToast("加入成功")
    onCancel()
  } else {
    //@ts-ignore
    showFailToast("加入失败" + (res.description ? `,${res.description}` : ''))
  }
}

const onCancel = () => {
  joinTeamId.value = 0;
  inputPassword.value = ''
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

onMounted(async () => {
  // await getUserCountForTeams(props.teamList);
  currentUser.value = await getCurrentUser()
});
/**
 * 更新队伍
 * @param id
 * @param userLengths
 */
const doUpdateTeam = (id: number, userLengths: number) => {
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

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  margin-left: -5px;
  height: 90px;
  object-fit: unset;
}
</style>