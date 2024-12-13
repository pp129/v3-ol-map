<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, reactive, toRefs } from "vue";
import { codeToHtml } from "shiki";

const props = defineProps({
  comp: {
    type: String,
    default: "",
  },
});

const state = reactive({
  sourceCode: "",
  showCode: false,
  component: "",
});

const html = async (comp: string) => {
  //@ts-ignore
  const code = await import(`@comp/${comp}/index.vue?raw`);
  return codeToHtml(code.default, {
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    cssVariablePrefix: "--shiki-",
    defaultColor: "light",
    lang: "vue",
  });
};

onMounted(() => {
  //@ts-ignore
  state.component = defineAsyncComponent(() => import(`../../components/${props.comp}/index.vue`));
  nextTick(async () => {
    state.sourceCode = await html(props.comp);
  });
});

const { showCode } = toRefs(state);

const handleClick = () => {
  state.showCode = !state.showCode;
};
</script>

<template>
  <div class="demo_preview">
    <div class="preview_box">
      <component :is="state.component"></component>
    </div>
    <div class="code_box">
      <div class="code" :class="{ show_code: showCode }">
        <div class="code__reference">
          <div class="code_content">
            <div v-html="state.sourceCode"></div>
          </div>
        </div>
      </div>
      <div class="operate_btn" @click="handleClick">{{ showCode ? "隐藏" : "显示" }}代码</div>
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
  cursor: pointer;
  z-index: 100;
}
.operate_btn:hover {
  background: #f2f2f2;
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
</style>
