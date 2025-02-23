import baseConfig from '@migan/prettier-config'

/** @type {import('prettier').Config} */
const config = {
  ...baseConfig,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'decorators'],
}
export default config
