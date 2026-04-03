import React from 'react'
import Waleed3 from './waleed3'
import Waleed4 from './Waleed4'
import { useState } from 'react'

export default function Waleed2({name1}) {
   const [name,setName]=useState('waleed')
 
  return (
    <div>
<Waleed3 name={name} setName={setName}  />
<Waleed4 name={name}/>
      
    </div>
  )
}
