import logFunction from "src/utils/exampleUtility.js";
import { useState, useEffect } from 'react';

import { exampleFetch } from 'src/services/exampleServices.js';

function Example() {
  // un esempio su come utilizzare le funzioni dentro la cartella utils
  useEffect(() => {
    logFunction();  
    exampleFetch().then(result => {
      console.log(result.data.message);
    });
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
