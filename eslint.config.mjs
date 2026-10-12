export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        console: 'readonly',
        fetch: 'readonly', // Node 22+ provides fetch globally; chapter 00 relies on it to avoid an SDK dependency.
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        setInterval: 'readonly'
      }
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-console': 'off',
      'no-process-exit': 'off'
    }
  }
];
