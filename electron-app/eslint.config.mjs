import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  // Базовые настройки
  {
    ignores: ['**/node_modules', '**/dist', '**/out'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // Настройки ESLint
  eslint.configs.recommended,

  // Настройки TypeScript
  ...tseslint.configs.recommended,

  // Настройки React
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules
    }
  },

  // React Hooks
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: reactHooks.configs.recommended.rules
  },

  // React Refresh (для Vite)
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      'react-refresh': reactRefresh
    },
    rules: reactRefresh.configs.vite.rules
  },

  // Общие правила для TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  },

  // Исключения для конфига Vite
  {
    files: ['electron.vite.config.ts'],
    rules: {
      'no-undef': 'off'
    }
  }
);