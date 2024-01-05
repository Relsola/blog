<template>
  <section class="">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-input
          v-model="regexp"
          clearable
          placeholder="请输入字面量正则表达式  /ab/g"
          @clear="result = `<span style='color: #a8abb2'>测试结果</span>`" />
      </el-col>
      <el-col :span="8"><el-button type="primary" @click="Test">exec</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-input
          v-model="text"
          resize="none"
          autosize
          clearable
          type="textarea"
          placeholder="请输入测试用例" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <p v-html="result"></p>
      </el-col>
    </el-row>
  </section>
</template>
<script setup lang="ts">
import { ref, Ref, watchEffect, watch } from 'vue';
import RegExpConfig from './RegExpList';
const { RS_DF } = RegExpConfig.static;

const props = defineProps<{ regV: string; exampleV: string }>();
const regexp = ref('');
const text = ref('');
const result: Ref<string> = ref(RS_DF);

// 监听是否点击了测试用例
watchEffect(() => {
  regexp.value = props.regV;
  text.value = props.exampleV;
});

// 改变输入清除匹配结果
watch([regexp, text], () => {
  if (result.value !== RS_DF) result.value = RS_DF;
});

// 生成正则表达式
function createRegex(regexp: Ref<string>): RegExp | string {
  let regex = null;
  try {
    regex = new Function(`return ${regexp.value}`)();
    regex = regex instanceof RegExp ? regex : '请输入正确的正则表达式';
  } catch (error) {
    regex = (error as Error).toString();
  }
  return regex;
}

// 生成匹配结果样式
function createSpan(string: string): string {
  return `<mark style="background: #79bbff; padding: 1px 2px; color: #000">${string}</mark>`;
}

// 开始测试
function Test() {
  const { value } = text;
  const regex = value === '' ? '请输入测试用例' : createRegex(regexp);
  const test = typeof regex === 'string' ? regex : value.replace(regex, val => createSpan(val));
  result.value = test === value ? 'null' : test;
}
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}

p {
  margin: 0;
  border: 1px solid #0002;
  min-height: 31px;
  line-height: 1.5;
  padding: 5px 11px;
  font-size: 14px;
  font-family: inherit;
  border-radius: 4px;
  color: #717377;
  background-color: #ffffff;
  background-image: none;
  transition: cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
