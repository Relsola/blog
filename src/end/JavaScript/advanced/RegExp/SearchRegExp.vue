<template>
  <el-table
    @click="Event"
    :data="tableData"
    border
    tooltip-effect="light"
    tooltip-placement="top"
    stripe
    style="width: 100%">
    <el-table-column
      v-for="{ label, prop, minWidth, align } in tableColumn"
      :label="label"
      :prop="prop"
      :min-width="minWidth"
      :key="prop"
      :align="align"
      empty-text="暂无匹配的正则表达式"
      show-overflow-tooltip />
    <el-table-column label="操作" align="center" min-width="60">
      <template #default="{ row: { regexp, example } }">
        <el-tooltip placement="top" content="复制" effect="light">
          <el-icon size="16" style="cursor: pointer;"><CopyDocument :reg="regexp" /></el-icon>
        </el-tooltip>
        <span style="margin: 0 5px"></span>
        <el-tooltip placement="top" content="测试用例" effect="light">
          <el-icon size="16" style="cursor: pointer;"><Edit :reg="regexp" :example="example" /></el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import RegExpConfig from './RegExpList';
import { copyToClipboardAsync } from '@utils/index';
import { reactive } from 'vue';

const { tableColumn, RegExpDate } = RegExpConfig;
const emit = defineEmits(['testExample']);

// 使用事件委托监听操作点击事件
function Event({ target }: { target: HTMLElement | null }) {
  if (!target || target.nodeName !== 'svg') return;
  const reg = target.getAttribute('reg') ?? '';
  const example = target.getAttribute('example');
  if (example) {
    emit('testExample', { reg, example });
    return;
  }
  const flag = copyToClipboardAsync(reg);
  ElMessage({
    showClose: true,
    message: `复制${flag ? '成功' : '失败'}`,
    type: flag ? 'success' : 'error'
  });
}

// 最多展示20条数据
let tableData: typeof RegExpDate = reactive([]);
tableData = RegExpDate.length > 10 ? RegExpDate.slice(0, 10) : [...RegExpDate];
</script>
<style scoped>
:deep(table) {
  margin: 0px;
}
</style>
