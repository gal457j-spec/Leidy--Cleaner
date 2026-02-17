// Flat configuration for ESLint (migration from .eslintrc.json)
module.exports = [
  // Global ignores (replaces .eslintignore)
  {
    ignores: ["public/**/*.js", "public/*.js", "node_modules/**"]
  },

  // Default rules for JS/TS/JSX/TSX files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      ecmaFeatures: { jsx: true }
    },
    env: { browser: true, es2022: true, node: true, jest: true },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "no-empty": ["warn", { "allowEmptyCatch": true }]
    }
  },

  // Tests override
  {
    files: ["**/*.test.js", "**/*.test.jsx", "**/*.spec.js", "**/*.spec.jsx"],
    env: { jest: true },
    globals: {
      describe: "readonly",
      it: "readonly",
      beforeEach: "readonly",
      afterEach: "readonly",
      beforeAll: "readonly",
      afterAll: "readonly",
      expect: "readonly",
      test: "readonly"
    }
  },

  // Cypress globals
  {
    files: ["cypress/**/*.js", "cypress/**/*.jsx"],
    globals: { cy: "readonly", Cypress: "readonly" }
  }
];
