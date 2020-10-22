import React, { useState } from 'react'

import { getAPIData } from '../test/utils'

const TestAPI = () => {
  const [value, setValue] = useState('')

  async function onSubmitClickHandler(e) {
    e.preventDefault()
    const response = await getAPIData(
      'https://jsonplaceholder.typicode.com/todos/1'
    )
    setValue(response.data.UserName)
  }

  return (
    <form onSubmit={onSubmitClickHandler}>
      <label htmlFor="name">Name</label>
      <input id="name" />
      <button type="submit">Submit</button>
      <div aria-label="sample-label">{value}</div>
    </form>
  )
}

export default TestAPI
