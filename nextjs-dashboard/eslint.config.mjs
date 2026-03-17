import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals'; // includes the eslint-plugin-jsx-a11y plugin for catching accessibility issues

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
