import logo from "../images/logo.svg"
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header(props) {

  const navigate = useNavigate()

  function signOut() {
    localStorage.removeItem('token')
    navigate('/sign-in', { replace: true })
  }

  return (
    <header className="header page__header">
      <img className="header__logo" src={logo} alt="Логотип сайта" />
      <div className="header__user">
        <p className="header__user-email">{props.userEmail}</p>
        <p className="header__user-status" onClick={signOut}>{props.userStatus}</p>
      </div>
    </header>
  )
}