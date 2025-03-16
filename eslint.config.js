import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTypeScript from '@typescript-eslint/eslint-plugin';
import parserTypeScript from '@typescript-eslint/parser';
import parserVue from 'vue-eslint-parser'; // Add this
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'


export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'typescript-eslint',
    files: ['**/*.{ts,tsx,vue}'], // Apply TS rules to TS and Vue files
    languageOptions: {
      parser: parserVue, // Use vue-eslint-parser for .vue files
      parserOptions: {
        parser: parserTypeScript, // Delegate TS parsing to @typescript-eslint/parser
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: {
      // 'no-unused-vars': 'warn', // Cảnh báo thay vì lỗi
      // '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  skipFormatting,
  vueTsConfigs.recommended,
];