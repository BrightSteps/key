'use strict';

const gtsRules = {
  'block-indentation': 'tab',
};

module.exports = {
  extends: ['recommended', 'stylistic'],

  rules: gtsRules,

  ignore: ['node_modules/**'],
};
