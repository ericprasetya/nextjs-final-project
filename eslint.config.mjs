import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ["**/*.jsx"],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  pluginReactConfig,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unsafe-optional-chaining": "off",
      "no-empty": "off",
      "no-unused-vars": "off",
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/jsx-props-no-spreading": "off",
      "import/no-unresolved": "off",
      "no-tabs": 0,
      "implicit-arrow-linebreak": "off",
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
      "no-else-return": [0, { "allowElseIf": true }],
      "react/jsx-one-expression-per-line": [0, { "allow": "none" }],
      "no-restricted-syntax": "off",
      "react/prop-types": [
        0,
        { "ignore": true, "customValidators": true, "skipUndeclared": true }
      ],
      "no-mixed-spaces-and-tabs": "off",
      "no-useless-catch": "off",
      "no-nested-ternary": "off",
      "no-extra-boolean-cast": "off",
      "react/no-array-index-key": "off",
      "react/forbid-prop-types": "off",
      "consistent-return": "off",
      "dot-notation": "off",
      "no-plusplus": "off",
      "no-unsafe-optional-chaining": "off",
      "no-continue": "off",
      "quotes": ["error", "double"],
      "import/extensions": "off",
      "no-empty": "off",
      "comma-dangle": ["off", "never"],
      "no-unused-vars": "off",
      "no-console": "off"
    },
  },
];
