import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Security: Prevent direct token access
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.object.name="localStorage"][callee.property.name="getItem"] > Literal[value="feathers-jwt"]',
          message:
            'Direct localStorage.getItem("feathers-jwt") is prohibited. Use secureStorage.getToken() from utils/secureStorage instead.',
        },
        {
          selector:
            'CallExpression[callee.object.name="localStorage"][callee.property.name="setItem"] > Literal[value="feathers-jwt"]',
          message:
            'Direct localStorage.setItem("feathers-jwt") is prohibited. Use secureStorage.setToken() from utils/secureStorage instead.',
        },
      ],
      // Warn about manual bearer tokens (too many to be errors yet)
      'no-warning-comments': [
        'warn',
        {
          terms: ['Bearer ${token}', 'Authorization: `Bearer'],
          location: 'anywhere',
        },
      ],
    },
  },
];
