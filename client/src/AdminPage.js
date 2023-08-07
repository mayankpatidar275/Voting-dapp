import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers'; // Import ethers library

import ABI from './contracts/Election.sol/Election.json';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [loader, setLoader] = useState(false);
  const [provider, setProvider] = useState(null);
  const [network, setNetwork] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    };

    initializeProvider();

    const getNetwork = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setNetwork(network.name);
      }
    };

    getNetwork();

    const deployContract = async () => {
      if (provider) {
        const signer = provider.getSigner();
        const contractAddress = '0x4e72fbE777b4Af6F5B773F9f14f7a25b4AF60a9D';
        const deployedContract = new ethers.Contract(contractAddress, ABI.abi, signer);
        setContract(deployedContract);
      }
    };
    deployContract();
    // console.log(ABI);
  }, [provider]);

  const addCandidate = async () => {
    setLoader(true);
    try {
      if (contract) {
        const tx = await contract.addCandidate(name);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Candidate added successfully");
      }
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
    setLoader(false);
  };

  if (loader) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow nb-5">
        <Link to="/">
          <h1 className="navbar-brand mx-auto">E - Voting System</h1>
        </Link>
      </nav>
      <div style={{ height: '60vh' }} className="d-flex justify-content-center align-items-center">
        <div>
          <h3>Enter the candidate name</h3>
          <form onSubmit={addCandidate}>
            <div className="col mt-5">
              <input type="text" className="form-control" placeholder="Candidate name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary m-3">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
