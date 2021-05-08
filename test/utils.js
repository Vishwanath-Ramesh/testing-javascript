import ReactDOM from 'react-dom'
import { getQueriesForElement } from '@testing-library/dom'
import faker from 'faker'

/**
 * We can use this function to render the JSX component or use in-built render frunction from react testing library.
 * @param {JSX.Element} ui
 */
function renderUI(ui) {
  const container = document.createElement('div')
  ReactDOM.render(ui, container)
  const queries = getQueriesForElement(container)
  return { container, ...queries }
}

function getAPIData(url) {
  console.log('object')
  return fetch(url).then((response) => response.json())
}

function buildLogin() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }
}

export { renderUI, getAPIData, buildLogin }
