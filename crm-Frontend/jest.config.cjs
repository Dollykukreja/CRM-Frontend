module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'jsx', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'

  // '^@/(.*)$': '<rootDir>/src/$1',
  // // '^@vue/test-utils$': '@vue/test-utils/dist/vue-test-utils.browser.js'
}
};