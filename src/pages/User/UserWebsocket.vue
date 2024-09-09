<template>
  <van-cell-group>
    <div id="output" ref="output" style="border:1px solid #ccc; height:365px; overflow: auto; margin: 20px 0;">
      <!-- 动态渲染消息，判断是否为当前用户发送 -->
      <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="{'message-right': msg.senderId === currentUser?.id, 'message-left': msg.senderId !== currentUser?.id}"
          class="message-wrapper"
      >
        <div class="message-content">
          <span v-if="msg.senderId === currentUser?.id"></span>
          <span v-else></span>
          <p>{{ msg.messageText }}</p>
          <small>{{ formatDate(msg.timestamp) }}</small>
        </div>
      </div>
    </div>

    <van-field v-model="message" placeholder="待发信息" @keydown.enter="sendMessage" />
    <van-button type="primary" @click="sendMessage">发送</van-button>
  </van-cell-group>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted ,nextTick} from 'vue';
import { showFailToast, Toast } from 'vant';
import { useRoute } from 'vue-router';
import { getCurrentUser } from '../../services/user'; // 假设这个方法在 api/user.js 文件中
import { UserType } from '../../models/user.js';

const route = useRoute();
const user = ref<UserType | null>(null); // 接收者
const userId = ref();
const currentUser = ref<UserType | null>(null); // 当前登录用户(发送者)
const wsAddr = ref(''); // 动态设置 WebSocket 地址
const message = ref('');
const messages = ref([]);
let websocket = null;
const output = ref(null);


// 生成房间ID，确保无论发送者接收者谁先连接都能连接到同一个房间
const generateRoomId = (id1, id2) => {
  return id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
};

onMounted(async () => {
  // 获取传递过来的 user 参数（接收者）
  // user.value = JSON.parse(route.query.user as string);
  userId.value = route.query.id
  console.log(userId.value)
  // 获取当前登录的用户（发送者）
  currentUser.value = await getCurrentUser();

  if (userId.value && currentUser.value) {
    // 生成房间 ID
    const roomId = generateRoomId(currentUser.value.id, userId.value);
    // 设置 WebSocket 地址，将 roomId 作为 WebSocket 的连接地址
    wsAddr.value = `ws://localhost:8080/api/websocket/${roomId}/${currentUser.value.id}`;
    connectWebSocket(); // 自动连接
  } else {
    showFailToast("无法获取用户信息")
  }
  // 等待 DOM 完全渲染完成后滚动到底部
  nextTick(() => {
    if (output.value) {
      output.value.scrollTop = output.value.scrollHeight; // 页面加载时滚动到底部
    }
  });
});

const formatDate = (timestamp) => {
  const now = new Date(timestamp);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

const writeToScreen = (message) => {
  messages.value.push(message);
  nextTick(() => {
    if (output.value) {
      output.value.scrollTop = output.value.scrollHeight; // 滚动到底部
    }
  });
};
/**
 * websocket连接启动
 */
const connectWebSocket = () => {
  if (wsAddr.value === '') {
    Toast('WebSocket地址未设置');
    return;
  }

  websocket = new WebSocket(wsAddr.value);

  websocket.onopen = () => {
    console.log("WebSocket 连接成功");
    writeToScreen("<span style='color:red'>连接成功，现在你可以发送信息啦！！！</span>");
  };

  websocket.onclose = (event) => {
    console.log("WebSocket 连接已关闭: ", event);
    writeToScreen("<span style='color:red'>WebSocket连接已断开!!!</span>");
  };
  //接受后端信息
  websocket.onmessage =async (event) => {
    console.log("收到服务器返回的信息:", event.data);
    try {
      const receivedData = JSON.parse(event.data);
      // 将收到的消息推入到 messages 列表中
      messages.value.push(receivedData);
      await nextTick();
      if (output.value) {
        output.value.scrollTop = output.value.scrollHeight; // 滚动到底部
      }
    } catch (error) {
      // 如果不是 JSON 格式，直接展示消息
      writeToScreen(`<span style="color:green">系统消息: ${event.data}</span>`);
    }
  };

  websocket.onerror = (event) => {
    writeToScreen('<span style="color: red;">发生错误:</span> ' + event.data);
  };
};

const closeWebSocket = () => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
};
/**
 * 给后端传输信息
 */
const sendMessage = () => {
  if (message.value === '') {
    showFailToast('请先填写发送信息');
    return;
  }
  if (!websocket) {
    showFailToast('WebSocket还没有连接，或者连接失败，请检测');
    return;
  }
  if (websocket.readyState === 3) {
    showFailToast('WebSocket已经关闭，请重新连接');
    return;
  }

  const messageData = {
    senderId: currentUser.value?.id,
    receiverId: userId.value, // 接收者ID从路由参数获取
    messageText: message.value,
    timestamp: new Date().toISOString(),
    isRead: 0
  };

  // 将消息显示在前端界面上
  // messages.value.push(messageData);

  // 发送 JSON 格式的消息到 WebSocket
  websocket.send(JSON.stringify(messageData));
  message.value = ''; // 清空输入框
};

const clearAddress = () => {
  wsAddr.value = '';
};

onUnmounted(() => {
  if (websocket) {
    websocket.close();
  }
});
</script>

<style scoped>
#output {
  border: 1px solid #ccc;
  height: 365px;
  overflow-y: auto; /* 确保只设置垂直滚动条 */
  margin: 20px 0;
}

.message-wrapper {
  display: flex;
  margin-bottom: 10px;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}
.message-content {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  max-width: 60%;
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-left .message-content {
  background-color: #d1eaff; /* 发送者的消息背景色 */
}

.message-right .message-content {
  background-color: #ffeedf; /* 接收者的消息背景色 */
}

.message-wrapper {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.message-content p {
  margin: 0;
  padding: 0;
}

.message-content small {
  display: block;
  margin-top: 5px;
  color: #999;
}
</style>
