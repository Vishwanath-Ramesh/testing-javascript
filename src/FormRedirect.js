import React, { useState } from 'react'
import { Redirect } from 'react-router'

import { getAPIData } from '../test/utils'

const FormRedirect = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [redirect, setRedirect] = useState(false)

  async function onSubmitHandler(event) {
    event.preventDefault()

    const { name, age } = event.target.elements
    const postData = {
      name: name.value,
      age: age.value,
      date: new Date().toISOString(),
    }
    setIsSaving(true)
    getAPIData(
      'https://jsonplaceholder.typicode.com/errors',
      postData
    ).then(() => setRedirect(true))
  }

  if (redirect) return <Redirect to="/" />

  return (
    <form onSubmit={onSubmitHandler}>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" />

      <label htmlFor="age">Age</label>
      <input type="number" id="age" name="age" />

      <button type="submit" disabled={isSaving}>
        Submit
      </button>
    </form>
  )
}

export default FormRedirect
