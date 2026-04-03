import React from 'react'
import { useState } from 'react'

export default function Waleed3({name,setName}) {
  console.log(name)
  // setName('shami')
  return (
    <div>
      <p>Waleed 3 </p>
        <p>{name}</p>
    
    <button type='button' onClick={()=>setName('shami')}>
      Change
    </button>
      
    </div>
  )
}
