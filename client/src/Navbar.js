import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({account , startTime}) => {
  let dateTime = new Date(1000*startTime)
  let startDateTime = new Intl.DateTimeFormat('en-US', { year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(dateTime);
  return (
    <nav className="navbar navbar-dark bg-dark shadow nb-5">
        <Link to="/">
            <h1 className="navbar-brand mx-auto">E - Voting System</h1>
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item text-white font-weight-bold">Voting started on:</li>
          <li className="nav-item text-white">{startDateTime}</li>
        </ul>
    </nav>
  )
}

export default Navbar