import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import Electionabi from './contracts/Election.json';
import { Link } from 'react-router-dom';

const AdminPage = () => {

const [name, setName] = useState("");

useEffect(() => {
  loadWeb3();
  LoadBlockchaindata();
}, [])

const[Currentaccount, setCurrentaccount] = useState("");
const[loader, setloader] = useState(true);
const[Electionsm, SetElectionsm] = useState();

const loadWeb3 = async () => {
  if(window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3){
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying Metamask !"
    );
  }
};

const LoadBlockchaindata = async () =>{
  setloader(true);
  const web3 = window.web3;
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];
  setCurrentaccount(account);
  const networkId = await web3.eth.net.getId();
  const networkData = Electionabi.networks[networkId];

  if(networkData){
    const election = new web3.eth.Contract(Electionabi.abi, networkData.address);
    SetElectionsm(election);
    setloader(false);
  } else{
    window.alert("the smart contract is not deployed current network")
  }
}

const addcandidate = async () => {
  setloader(true);
  await Electionsm.methods.addCandidate(name).send({from : Currentaccount}).on('transactionhash' ,()=>{
    console.log("successfully added");
  })
  setloader(false);
}

if(loader){
  return <div>Loading...</div>
}

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark shadow nb-5">
          <Link to="/">
              <h1 className="navbar-brand mx-auto">E - Voting System</h1>
          </Link>
      </nav>
      <div style={{height: '60vh'}} className="d-flex justify-content-center align-items-center">
      <div>
          <h3>Enter the candidate name</h3>
          <form onSubmit={addcandidate}>
              <div className="col mt-5">
                  <input type="text" className="form-control" placeholder="Candidate name" value={name} onChange={(e) => setName(e.target.value)}/>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                  <button type="submit" className="btn btn-primary m-3">Add</button>
              </div>
          </form>
      </div>
      </div>
    </div>
  )
}
export default AdminPage
