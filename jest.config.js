module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Setting the test environment to node. i.e., window/DOM object is not accessible
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.css$': require.resolve('./test/style-mock.js'), // If you are importing the React component which in turn imports css files internally, jest throws Sytax error. For that, we need resolve to mock module.
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Imports the supplied files in all the test suites
}
