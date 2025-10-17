// eslint.config.js or eslint.config.ts
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  // The helper function expects a series of valid config objects.
  // The first object for files is correct.
  
  {
    // @ts-ignore
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // This is the corrected part.
  // Global ignores must be inside an object with an `ignores` key.
  {
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  // The rest of your configurations
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
)