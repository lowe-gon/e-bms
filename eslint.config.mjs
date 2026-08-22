import clerkNext from '@clerk/eslint-plugin/next';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintPluginPrettierRecommended,

  {
    plugins: { '@clerk/next': clerkNext },
    rules: {
      '@clerk/next/require-auth-protection': [
        'error',
        {
          protected: ['**'],
          public: ['src/app/sign-in/**', 'src/app/sign-up/**'],
          resources: {
            routeHandlers: true,
            serverFunctions: true,
            serverComponentEntrypoints: false, // Skip for now.
          },
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
