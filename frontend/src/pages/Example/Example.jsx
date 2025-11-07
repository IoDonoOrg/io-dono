import ExampleComponent from "src/components/exampleComponent";

import logFunction from "src/utils/exampleUtility.js";
import { useState, useEffect } from 'react';

import { exampleFetch } from 'src/services/exampleServices.js';

function Example() {
  useEffect(() => {
    // logFunction() - una funzione importata dalla cartella utils
    logFunction();  
    // exampleFetch() - una funzione definita nella cartella services
    // che fa una chiamata di esempio al backend
    exampleFetch().then(result => {
      console.log(result.data.message);
    });
  }, [])

  return (
    <>
      <div>
        <p>Example page</p>
      </div>
      <ExampleComponent/>
    </>
  )
}

export default Example
