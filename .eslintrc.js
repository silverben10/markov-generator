module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    "max-len": ["error", { code: 100, ignoreComments: true }],
    "operator-linebreak": 0,
    "no-restricted-syntax": 0,
  },
};
