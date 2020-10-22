import React, { useState } from 'react'

const InputValidation = () => {
  const [value, setValue] = useState(0)

  return (
    <div>
      <input
        id="sample-input"
        type="number"
        onChange={(event) => setValue(event.target.value)}
      />

      {value <= 0 ? (
        <div role="error" id="error">
          Invalid value
        </div>
      ) : null}
    </div>
  )
}

export default InputValidation
