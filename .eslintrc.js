module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-deprecated-v-bind-sync": "off",
    "vue/no-deprecated-filter": "off",
    "vue/no-deprecated-slot-attribute": "off",
    "vue/no-deprecated-slot-scope-attribute": "off",
    "vue/no-deprecated-v-on-native-modifier": "off",
    "vue/no-v-text-v-html-on-component": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-empty": "off",
    "vue/no-unused-components": "off",
    "vue/no-unused-vars": "off",
    "no-dupe-keys": "off",
    "no-constant-condition": "off",
    "no-cond-assign": "off",
  },
};
