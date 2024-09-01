<template>
  <form action="/public">
    <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>

  <van-divider>已选标签</van-divider>
  <div style="text-align: center;">
    <van-tag v-if="activeTagsIds.length === 0" plain type="primary">暂无标签</van-tag>
  </div>
  <van-row gutter="20">
    <van-col v-for="tag in activeTagsIds" :key="tag">
      <van-tag closeable size="small" type="primary" @close="closeTag(tag)">
        {{ tag }}
      </van-tag>
    </van-col>
  </van-row>

  <van-divider>选择标签</van-divider>

  <!-- 提示消息 -->
  <div v-if="noResults" style="text-align: center; color: #999;">
    未搜索到相关内容
  </div>

  <!-- 标签选择列表 -->
  <van-tree-select
      v-else
      v-model:active-id="activeTagsIds"
      v-model:main-active-index="activeTagsIndex"
      :items="tagList"
  />
  <div style="padding: 12px">
    <van-button block type="primary" @click="doSearchResult()">搜索</van-button>

  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from "vue-router";

//vue-router组件
const router = useRouter();

// 原始标签列表
const orginTagList = [
  {
    text: '性别',
    children: [
      {text: '男', id: '男'},
      {text: '女', id: '女'},
    ],
  },
  {
    text: '方向',
    children: [
      {text: 'Java', id: 'Java'},
      {text: 'C++', id: 'C++'},
      {text: 'C', id: 'C'},
      {text: 'Python', id: 'Python'},
      {text: 'Linux', id: 'Linux'},
      {text: '运维', id: '运维'},
      {text: 'GoLong', id: 'GoLong'},
      {text: 'Android', id: 'Android'},
      {text: '鸿蒙', id: '鸿蒙'},
    ],
  },
  {
    text: '水平',
    children: [
      {text: '初级', id: '初级'},
      {text: '中级', id: '中级'},
      {text: '高级', id: '高级'},
    ],
  },
];
// 已选标签
const activeTagsIds = ref([]);
const activeTagsIndex = ref(0);
// 当前展示的标签列表
let tagList = ref(orginTagList);
// 是否显示“未搜索到相关内容”提示
const noResults = ref(false);
// 搜索框的输入值
let searchValue = ref('');

/**
 * 可关闭标签功能
 * @param tag
 */
const closeTag = (tag) => {
  activeTagsIds.value = activeTagsIds.value.filter((item) => item !== tag);
};


/**
 * 搜索过滤功能
 * @param val
 */
const onSearch = (val) => {
  const searchText = searchValue.value.trim();
  if (!searchText) {
    tagList.value = orginTagList; // 如果搜索内容为空，恢复原始标签列表
    noResults.value = false; // 隐藏提示信息
    return;
  }
  // 根据搜索内容过滤标签列表
  tagList.value = orginTagList.map((parentTag) => {
    const filteredChildren = parentTag.children.filter((item) =>
        item.text.includes(searchText)
    );
    return {
      ...parentTag,
      children: filteredChildren,
    };
  }).filter(parentTag => parentTag.children.length > 0); // 只保留有匹配子项的父项

  // 如果过滤后的列表为空，显示提示信息
  noResults.value = tagList.value.length === 0;
};
/**
 * 取消搜索功能
 */
const onCancel = () => {
  searchValue.value = ''; // 清空搜索框内容
  tagList.value = orginTagList; // 恢复原始标签列表
  noResults.value = false; // 隐藏提示信息
};

/**
 * 搜索功能
 */
const doSearchResult = () => {
  router.push({
    path: "/user/list",
    query: {
      tags: activeTagsIds.value,
    }
  })
};
</script>

<style scoped>
/* 在此处添加自定义样式 */
</style>
