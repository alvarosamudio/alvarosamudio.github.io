import sveltePlugin from "eslint-plugin-svelte"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"

export default [
  {
    ignores: [
      ".svelte-kit/**",
      "out/**",
      "build/**",
      "node_modules/**",
    ],
  },
  ...sveltePlugin.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: sveltePlugin.parser,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]
