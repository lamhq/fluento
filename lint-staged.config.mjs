/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.js': 'prettier --write',
  '*.ts?(x)': ['eslint --fix', 'prettier --write'],
};
