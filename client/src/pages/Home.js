import React from 'react'
import { Link } from 'react-router-dom'
import { useBlockchainContext } from '../context/BlockchainContext';

import Navbar from '../components/Navbar';

const Home = () => {
    const { currentAccount } = useBlockchainContext();

  return (
    <div>
      <Navbar account={null} startTime={null} />
      <p className="my-5 mt-4 text-center">
        Your address: <span className="font-weight-bold">{currentAccount}</span>
      </p>
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