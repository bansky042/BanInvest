import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default tseslint.config(
  // Base JS config
  eslint.configs.recommended,
  // TypeScript recommended config
  ...tseslint.configs.recommended,
  // React recommended config
  reactPlugin.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      /* --- General Clean Code Rules --- */
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],

      /* --- TypeScript Rules --- */
      "@typescript-eslint/no-explicit-any": "off", // ✅ disables your error
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      /* --- React Rules --- */
      "react/react-in-jsx-scope": "off", // Next.js handles this
      "react/prop-types": "off", // not needed for TS
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* --- Next.js Rules --- */
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
