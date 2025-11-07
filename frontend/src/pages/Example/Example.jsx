import logFunction from "src/utils/exampleUtility.js";
import { useState, useEffect } from 'react';

function Example() {
  // un esempio su come utilizzare le funzioni dentro la cartella utils
  useEffect(() => {
    logFunction();  
  }, [])

  return (
    <>
      <div>
        <p>Example page</p>
      </div>
    </>
  )
}

export default Example
