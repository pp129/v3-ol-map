module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
    "plugin:storybook/recommended",
    "plugin:storybook/recommended",
    "plugin:storybook/recommended"
  ],
  rules: {
    "vue/no-v-html": 0,
    "vue/v-on-event-hyphenation": 0,
    "vue/no-template-shadow": 0,
    "vue/multi-word-component-names": 0,
    "vue/no-deprecated-v-on-native-modifier": "off",
  },
};
