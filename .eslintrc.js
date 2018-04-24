module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb',
  ],
  plugins: [
    'react',
  ],
  settings: {
    'import/resolver': 'webpack',
    'import/extensions': ['.js', '.jsx', '.scss'],
    react: {
      pragma: 'React',
      version: '16.0',
    },
  },
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-extraneous-dependencies': 'off',
    'function-paren-newline': 'off',
    'max-len': [2, 80, 2, {
      // code: 100,
      // comments: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: true,
      ignorePattern: '[^d=/?#][^?#]',
    }],
    'no-underscore-dangle': 'off',
    'no-restricted-globals': 'off',
    'no-bitwise': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'react/forbid-prop-types': [1, {
      forbid: ['any'],
    }],
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx'],
    }],
    'react/sort-comp': [2, {
      order: [
        'lifecycle',
        'everything-else',
        '/^render.+$/',
        'render',
      ],
    }],
    'react/jsx-max-props-per-line': 'off',
    'spaced-comment': 0,
  },
};
