<script setup lang="ts">
import { reactive, toRefs } from "vue";

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
const handleOpenLink = () => {
  window.open(props.url, "_blank");
};
const state = reactive({
  showCode: false,
});
const { showCode } = toRefs(state);

const handleClick = () => {
  state.showCode = !state.showCode;
};
</script>

<template>
  <div class="demo_preview">
    <div class="code_box">
      <div class="code" :class="{ show_code: showCode }">
        <div class="code__reference">
          <iframe :src="url" width="100%" height="400px"></iframe>
        </div>
      </div>

      <div class="operate_btn">
        <div class="source">
          <img src="https://openlayers.org/theme/img/logo-dark.svg" width="16" height="16" alt="" /> OpenLayers API:
          <span class="bold">{{ title }}</span>
        </div>
        <i class="code" @click="handleClick"></i>
        <i class="link" @click="handleOpenLink"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo_preview {
  margin: 20px 0;
  border: 1px solid #efefef;
  border-radius: 6px;
  overflow: hidden;
}
.preview_box {
  padding: 24px;
  width: 100%;
  height: 400px;
}
.operate_btn {
  position: relative;
  height: 46px;
  line-height: 46px;
  color: #666;
  text-align: center;
  background: #f7f7f7;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.operate_btn .source {
  margin-right: auto;
  display: flex;
}
.operate_btn .source img {
  margin-right: 8px;
}
.operate_btn i {
  display: block;
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 16px;
}
.operate_btn .link {
  background: url(../../assets/link.png) no-repeat center;
}
.operate_btn .code {
  background: url(../../assets/code.png) no-repeat center;
}
.code {
  border-top: 1px solid #efefef;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.code .code__reference {
  overflow-y: hidden;
  overflow-x: auto;
}
.show_code {
  grid-template-rows: 1fr;
}
.demo_preview iframe header {
  display: none !important;
}
.bold {
  color: #409eff;
  font-weight: bold;
  margin-left: 8px;
}
</style>
