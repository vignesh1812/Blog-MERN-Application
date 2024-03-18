import React, { useContext } from 'react'
import {UserContext} from '../Context/userContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

  const navigate=useNavigate()
  const{SetcurrentUser}=useContext(UserContext)
  SetcurrentUser(null)
  navigate('/login')
  return (
    <>
    logout
    </>
  )
}

export default Logout