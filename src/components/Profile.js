import React, { useContext, useState } from 'react'
import { Context } from '..';

export default function Profile() {
  const {isAuthenticated,loading,user} = useContext(Context);
    
    
  return (
    <div>
      <h1>{user.name}</h1>
      <h3>{user.email}</h3>
    </div>
  )
}
