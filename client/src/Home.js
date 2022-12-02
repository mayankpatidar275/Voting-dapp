import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow nb-5">
          <Link to="/">
              <h1 className="navbar-brand mx-auto">E - Voting System</h1>
          </Link>
      </nav>
      <div style={{height: '40vh'}} className="d-flex justify-content-center align-items-center">
          <Link to="/admin">
            <button type="button" className="btn-lg m-4 btn btn-primary">Admin</button>
          </Link>
          <Link to="/votingPage">
            <button type="button" className="btn-lg m-4 btn btn-success"> Voter </button>
          </Link>
      </div>
    </div>
  )
}

export default Home