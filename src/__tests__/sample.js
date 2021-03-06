import React from 'react'
import { Redirect } from 'react-router'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getByRole, getQueriesForElement } from '@testing-library/dom'
import { renderHook, act } from '@testing-library/react-hooks'
import { build, fake, sequence } from 'test-data-bot'
import { build as builder, fake as faker } from '@jackfranklin/test-data-bot'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
// import faker from 'faker'

import { getAdults } from '../matchSnapshot'
import ToHaveTextContent from '../toHaveTextContent'
import InputLabel from '../inputLabel'
import Login from '../Login'
import InputValidation from '../InputValidation'
import TestAPI from '../testAPI'
import ErrorBoundary from '../ErrorBoundary'
import FormRedirect from '../FormRedirect'
import ReactRoutes from '../ReactRoutes'
import { useCounter } from '../useCounter'
import TestUnmount from '../TestUnmount'
import { renderUI, getAPIData } from '../../test/utils'
import { handlers } from '../../test/server-handlers'
import EasyButton from '../EasyButton'
import { ThemeProvider } from '../useTheme'

const server = setupServer(...handlers)

jest.mock('../../test/utils') // All the functions which are exported in the specified module will be mocked
// const jestMock = jest.fn() // Instead of mocking entire module, we can mock specific function by this.

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

// afterEach : This is one of the Lifecycle method of jest which runs after each one of the tests in this file completes.
afterEach(() => {
  jest.clearAllMocks() // Clears the properties of all mocks so that no conflict can occur if one mock function is used in multiple test cases.
  server.resetHandlers()
})

// beforeEach : This is one of the lifecycle method of jest which runs before running each of the test cases
beforeEach(() => {
  // document.body.innerHTML = ''
  // ? If we are using react testing library(@testing-library/react), it(render method) will take care of all the cleanups, unmounting components for us.
})

// beforeAll : This is one of the Lifecycle method of jest which runs before running any of the tests in this file
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {}) // When console.error is called, jest will call the callback function passed to the 'mockImplementation' function which does nothing. So that error wont be displayed in the console.
  server.listen() // listen to mock rest api calls for each tese cases
})

// afterAll : This is one of the Lifecycle method of jest which runs after executing all of the tests in this file
afterAll(() => {
  console.error.mockRestore() // It restores the console.error to it's original implementation
  jest.useRealTimers() // If we are faking timers in any of the test case, we have restore to use real timers.
  server.close()
})

test('matchSnapshot', () => {
  const adults = getAdults() // Pretend this data is fetched from API.

  /* 
  For the below test case, we checked the result from the function with the harcoded value below. Since the data is retrieved from API, 
  so it can change from time to time. Checking the harcoded value may fail at different point of time. For that we use 'toMatchSnapshot'.
  
  Test case with the harcoded values.  
  expect(adults).toEqual([
    { age: 22, name: 'Arun' },
    { age: 18, name: 'Suresh' },
    { age: 55, name: 'Dinesh' },
    { age: 44, name: 'Aravind' },
    { age: 23, name: 'Vijay' },
    { age: 33, name: 'Vijay' },
  ])
  */

  /* 
  toMatchSnapshot -  Executes the test case with the result obtained from the actual returned value. This will create a snapshot folder where the test suite is located.
  So if the test suite executed at some other time, it matches the data present in the snapshot directory.
  In order to match with the updated value we need to update the snapshot by '$ npm test -- -u'.
  Since this method creats a additional files in our source directory, we can opt for different method which is 'toMatchInineSnapshot'.

  Test case with the value from the toMatchSnapshot
  expect(adults).toMatchSnapshot()
  */

  /*
  toMatchInineSnapshot - It will get the the results and replace the returned value inside the 'toMatchInlineSnapshot' function instead of 
  creating a snapshot file separately.
  So whenever we run tests with update snapshot flag, the jest will replace the new value inline.
  */

  expect(adults).toMatchInlineSnapshot(`
    Array [
      Object {
        "age": 22,
        "name": "Arun",
      },
      Object {
        "age": 18,
        "name": "Suresh",
      },
      Object {
        "age": 55,
        "name": "Dinesh",
      },
      Object {
        "age": 44,
        "name": "Aravind",
      },
      Object {
        "age": 23,
        "name": "Vijay",
      },
      Object {
        "age": 33,
        "name": "Santhosh",
      },
    ]
  `)
})

test('toHaveTextContent', () => {
  // * render : It creates a wrapping div, so that we dont have to create a new div and render the component in there. Also it performs cleanups by itself like unmounting the component, removing the wrapper div etc.
  const { getByText } = render(<ToHaveTextContent />)

  // * The below command prints to test console, how will the screen looks like after rendering the particular component to the DOM. In our case, 'ToHaveTextContent'
  // screen.debug()

  const submitButton = getByText('Submit')

  // * The above button can also be referenced by using 'screen' utils from rtl. This can be helpfull when we are acessing the elements from entire document body not specific to the rendering component in render method
  // const submitButtonFromScreen = screen.getByRole('button', { name: /submit/i }) // gets the submit button by the 'Name' property of Accessibility of elements(WCAG) with case ignored

  // * Using '.click' works fine, but what if you wanted to fire an event that doesn't have a dedicated method (like mouseover). Rather using 'button.click()', use 'button.dispatchEvent'
  // submitButton.click()

  //   const mouseClickEvent = new MouseEvent('click', {
  //     bubbles: true,
  //     cancelable: true,
  //     button: 0
  //   })
  // submitButton.dispatchEvent(mouseClickEvent)

  // * The above click handler boilerplate can be eliminated by using fireevent from rtl.
  // fireEvent.click(submitButton)

  // * Instead of using 'fireEvent', we can use 'userEvent'. 'fireEvent' is specific to any type of events like 'click', 'hover' etc., whereas 'userEvent' is common to all type of user events. All type of user events(click, hover etc) can be made possible by using 'userEvent' alone.
  userEvent.click(submitButton)

  /*
   * When the above test case fails, the error message is not clear. Also, instead of accessing the 'textContent' from the whole object,
   * we have a library called '@testing-library/jest-dom'. Having this library configured, we can check for the test cases with the below
   * method very easily.
   */
  // expect(submitButton.textContent).toBe('Submit')
  expect(submitButton).toHaveTextContent('Submit')
})

test('inputLabel', () => {
  // const { getByLabelText } = renderUI(<InputLabel />) // Custom utility function method.
  const { getByLabelText, debug } = render(<InputLabel />)
  const inputLabel = getByLabelText('Test Label')
  // const inputLabel = queries.getByLabelText(div, /Test Label/i)  // Ignore Casing
  expect(inputLabel).toHaveAttribute('type', 'number')
  // debug()  // Debug during tests
})

test('inputValidation', () => {
  // container : render method creates a wrapping div, in that the supplied component gets rendered
  const { container, getByRole, rerender, queryByRole } = render(
    <InputValidation />
  )
  const inputControl = container.querySelector('input')
  // fireEvent.change(inputControl, { target: { value: '-10' } }) // Change event
  userEvent.type(inputControl, '-1')
  // rerender(<InputValidation value={20} />)  // When you need to rerender the component with different props
  expect(getByRole('error')).toHaveTextContent('Invalid value') // getByRole : get the element by role, if the element does not exists, it will throw error
  // expect(queryByRole('error')).toBeNull() // queryByRole : same as getByRole except that it will not throw error. So that we can use this to check whether the element is preset or not.
})

test('testAPI', async () => {
  const mockAPIResponse = 'TEST_USER'
  getAPIData.mockResolvedValueOnce({ data: { UserName: mockAPIResponse } })
  const { getByLabelText, getByText } = render(<TestAPI />)
  const inputControl = getByLabelText(/name/i)
  const buttonControl = getByText('Submit')
  fireEvent.click(buttonControl)
  expect(getAPIData).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/todos/1'
  )
  expect(getAPIData).toHaveBeenCalledTimes(1)
  await waitFor(() =>
    expect(getByLabelText('sample-label')).toHaveTextContent(mockAPIResponse)
  )
})

test('ErrorBoundary', () => {
  getAPIData.mockResolvedValueOnce({ data: { result: 'SUCCESS' } })
  render(
    <ErrorBoundary>
      <ErrorComponent throwError />
    </ErrorBoundary>
  )

  // render(<ErrorComponent throwError />, { wrapper: ErrorBoundary }) // The above statement can also be written as like this, so that we dont have to nest the components whenver we using rerender

  expect.any(Error)
  expect(getAPIData).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/errors'
  )
  expect(getAPIData).toHaveBeenCalledTimes(1)

  /* Even though we have handled for any error occurences in ErrorBoundary's componentDidCatch method, 
  the error will be thrown from both jest and React. So in order to handle this, we expect, there will be two console error and those 
  errors will be cleared before running any of the tests in this file using beforeAll lifecycle method. So with the below code,
  we ensure that console.error does not mess up with the other console error in the any of the test cases */
  expect(console.error).toHaveBeenCalledTimes(2)
})

/* Instead of giving the harcoded values for test cases, we can generate the values randomly, so that test suites can be executed 
   with different values and fix the isses if there is one.  */
const postDataBuilder = build('Post').fields({
  name: fake((f) => f.lorem.words()),
  age: fake((f) => `${f.random.number({ min: 1, max: 100 })}`),
})

test('FormRedirect', async () => {
  getAPIData.mockResolvedValueOnce()

  const fakePost = {
    ...postDataBuilder(),
    date: expect.any(String),
  }
  const preDate = new Date().getTime()
  const { getByLabelText, getByText } = render(<FormRedirect />)
  getByLabelText('Name').value = fakePost.name
  getByLabelText('Age').value = fakePost.age
  const submitButton = getByText('Submit')

  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
  expect(getAPIData).toHaveBeenCalledWith(
    'https://jsonplaceholder.typicode.com/errors',
    fakePost
  )
  expect(getAPIData).toHaveBeenCalledTimes(1)
  const postDate = new Date().getTime()
  const date = new Date(getAPIData.mock.calls[0][1].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  await waitFor(() => expect(Redirect).toHaveBeenCalledWith({ to: '/' }, {}))
})

// ToDo : Need to look after sometime
// test('ReactRoutes - Check for route navigation', () => {
//   const history = createMemoryHistory({ initialEntries: ['/'] })
//   const { getByLabelText, getByText, debug } = render(
//     <Router history={history}>
//       <ReactRoutes />
//     </Router>
//   )
//   debug()
// })

test('Counter - Testing custom hook with no initial value', () => {
  // const result = renderCustomHook({ initialProps: {} }) // Instead using custom functions, we can also use the in-built function(below code) to render react custom hooks
  const { result } = renderHook(useCounter)
  expect(result.current.count).toBe(0)
  result.current.increment()
  expect(result.current.count).toBe(1)
  result.current.decrement()
  expect(result.current.count).toBe(0)
})

test('Counter - Testing custom hook with providing initialCount value', () => {
  // const result = renderCustomHook({ initialProps: { initialCount: 2 } }) // Instead using custom functions, we can also use the in-built function(below code) to render react custom hooks
  const { result } = renderHook(useCounter, {
    initialProps: { initialCount: 2 },
  })
  expect(result.current.count).toBe(2)
  result.current.increment()
  expect(result.current.count).toBe(3)
  result.current.decrement()
  expect(result.current.count).toBe(2)
})

test('Counter - Testing custom hook with providing step value', () => {
  // const result = renderCustomHook({ initialProps: { step: 2 } }) // Instead using custom functions, we can also use the in-built function(below code) to render react custom hooks
  const { result } = renderHook(useCounter, { initialProps: { step: 2 } })
  expect(result.current.count).toBe(0)
  result.current.increment()
  expect(result.current.count).toBe(2)
  result.current.decrement()
  expect(result.current.count).toBe(0)
})

test('Counter - Testing custom hook with providing step value and updating it', () => {
  // const result = renderCustomHook({ initialProps: { step: 2 } }) // Instead using custom functions, we can also use the in-built function(below code) to render react custom hooks
  const { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 2 },
  })
  expect(result.current.count).toBe(0)
  result.current.increment()
  expect(result.current.count).toBe(2)
  rerender({ step: 1 })
  result.current.decrement()
  expect(result.current.count).toBe(1)
})

function ErrorComponent({ throwError }) {
  if (throwError) throw new Error('Test Error')
  return null
}

test('TestUnmount - Testing whether the cleanup is happening when the component is unmounting', () => {
  jest.useFakeTimers() // Since we are using timers function(setInterval) in the component, so rather than waiting for the time to meet, we can use jest's inbuit functions to fake the timers.
  const { unmount } = render(<TestUnmount />)
  unmount()
  jest.runOnlyPendingTimers() // It executes the tasks that have been queued by setTimeout() or setInterval() up to this point
  expect(console.error).not.toHaveBeenCalled()
})

/* Instead of duplication the code, we can create a function and use it at different places */
function renderCustomHook({ initialProps }) {
  const result = {}

  function TestComponent() {
    result.current = useCounter({ ...initialProps })
    return null
  }
  render(<TestComponent {...initialProps} />)

  return result
}

function buildLogin() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  }
}

const buildLoginV2 = builder({
  fields: {
    username: faker((f) => f.internet.userName()),
    password: faker((f) => f.internet.password()),
  },
})

test('Login form submission', () => {
  let inputData = null
  const { username, password } = buildLoginV2() // buildLogin()

  const onSubmitHandler = (submittedData) => (inputData = submittedData)
  render(<Login onSubmit={onSubmitHandler} />)
  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', { name: /submit/i }))
  expect(inputData).toEqual({
    username,
    password,
  })

  // * The above assertion can also be written as below
  // const onSubmitHandler = jest.fn()
  // expect(onSubmitHandler).toHaveBeenCalledWith({
  //   username,
  //   password,
  // })
  // expect(onSubmitHandler).toHaveBeenCalledTimes(1)
})

test('React context testing - renders with the light styles for the light theme', () => {
  const Wrapper = ({ children }) => (
    <ThemeProvider initialTheme={'light'}>{children}</ThemeProvider>
  )
  render(<EasyButton>Easy</EasyButton>, { wrapper: Wrapper })
  const button = screen.getByRole('button', { name: /easy/i })
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('React context testing - renders with the dark styles for the dark theme', () => {
  const Wrapper = ({ children }) => (
    <ThemeProvider initialTheme={'dark'}>{children}</ThemeProvider>
  )
  render(<EasyButton>Easy</EasyButton>, { wrapper: Wrapper })
  const button = screen.getByRole('button', { name: /easy/i })
  expect(button).toHaveStyle(`
    color: white;
    background-color: black;
  `)
})
