import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useBlockchainContext } from '../context/BlockchainContext';
import BlocksAnimation from '../assets/Blocks.gif';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [loader, setLoader] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { contract, currentAccount } = useBlockchainContext();

  const addCandidate = async () => {
    setLoader(true);
    try {
      if (contract) {
        const tx = await contract.addCandidate(name);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Candidate added successfully");
        setSuccessMessage('Candidate added successfully'); // Display success message
        setTimeout(() => {
          setSuccessMessage(''); // Clear success message after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
    setLoader(false);
  };

  return (
    <div>
      <Navbar account={null} startTime={null} />

      <p className="my-5 mt-4 text-center">
        Your address: <span className="font-weight-bold">{currentAccount}</span>
      </p>

      <div style={{ height: '60vh' }} className="d-flex justify-content-center align-items-center">
        {loader ? (
          <div className="text-center">
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Adding candidate</p>
          <img src={BlocksAnimation} alt="Loading" />
        </div>
        
        ) : (
          <div>
            <h3>Enter the candidate name</h3>
            <form onSubmit={addCandidate}>
              <div className="col mt-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Candidate name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="btn btn-primary m-3">
                  Add
                </button>
              </div>
              {successMessage && (
              <p className="text-success">{successMessage}</p>
            )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
