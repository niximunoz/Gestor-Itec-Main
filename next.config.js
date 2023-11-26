const path = require('path')
const { buildId } = require('./loggerId')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
])

module.exports = withTM({
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    USER_TOKEN: process.env.USER_TOKEN,
    PASS_TOKEN: process.env.PASS_TOKEN,
    APICORE_BASE_URL_API: process.env.APICORE_BASE_URL_API,
    APP_SECRET_KEY_ENCRYPT: process.env.APP_SECRET_KEY_ENCRYPT,
    APP_SECRET_KEY_IV_ENCRYPT: process.env.APP_SECRET_KEY_IV_ENCRYPT,
    BUILD_VERSION: buildId
  },
  eslint: {
    ignoreDuringBuilds: true
  }
})
