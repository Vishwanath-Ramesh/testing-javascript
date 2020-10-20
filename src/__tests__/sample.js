import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { getAdults } from '../matchSnapshot'
import ToHaveTextContent from '../toHaveTextContent'

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
  const { getByText } = render(<ToHaveTextContent />)
  const submitButton = getByText('Submit')
  debugger
  fireEvent.click(submitButton)

  // expect(submitButton.textContent).toBe('Submit')

  /* 
  When the above test case fails, the error message is not clear. Also, instead of accessing the 'textContent' from the whole object,
  we have a library called '@testing-library/jest-dom'. Having this library configured, we can check for the test cases with the below
  method very easily.
   */
  expect(submitButton).toHaveTextContent('Submit')
})
