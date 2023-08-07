import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'; // Import ethers library
import ABI from './contracts/Election.sol/Election.json';
import Navbar from './Navbar';
import Body from './Body';

function VotingPage() {
  const [loader, setLoader] = useState(false);
  const [currentAccount, setCurrentAccount] = useState('');
  const [provider, setProvider] = useState(null); 
  const [contract, setContract] = useState(null);
  const [candidateList, setCandidateList] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [votingDuration, setVotingDuration] = useState(0);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      // setLoader(true);
      console.log("loadWeb3");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      console.log("loadWeb3 after");
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying Metamask !");
    }
  };

  const loadBlockchainData = async () => {
    try {
      console.log("trying provider");
      if (provider) {
        setLoader(true);
        const signer = provider.getSigner();
      const contractAddress = '0x4e72fbE777b4Af6F5B773F9f14f7a25b4AF60a9D';
      const deployedContract = new ethers.Contract(contractAddress, ABI.abi, signer);
      
      const accounts = await provider.listAccounts();
      const account = accounts[0];
      setContract(deployedContract);
      console.log("setting current account");
      setCurrentAccount(account);  
      console.log("done setting current account");
      // setLoader(false);
      }

    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  }; 
  
  const loadCandidateData = async () => {
    try {
      if(provider && contract){
        // setLoader(true);
        console.log("loadCandidate");
      const candidateCount = (await contract.candidatesCount()).toNumber();
  
      const fetchedCandidates = [];
      for (let i = 1; i <= candidateCount; i++) {
        const fetchedCandidate = await contract.candidates(i);
        const candidateObject = {   
          id: fetchedCandidate[0].toNumber(), // Assuming the first BigNumber is the ID
          name: fetchedCandidate[1],          // Assuming the second value is the name
          voteCount: fetchedCandidate[2].toNumber() // Assuming the third BigNumber is the vote count
        };  
        fetchedCandidates.push(candidateObject);
      }
    
      console.log(fetchedCandidates); 
      const startTime = await contract.startTime();
      const votingDuration = await contract.votingDuration();
  
      setCandidateList(fetchedCandidates);
      console.log(candidateList);
      setStartTime(startTime.toNumber());
      setVotingDuration(votingDuration.toNumber());
      console.log("loadCandidate after");
      setLoader(false);
      }
    } catch (error) {
      console.error("Error loading candidate data:", error);
    }
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (provider) {
        console.log("Loading blockchain data...");
        await loadBlockchainData();
      }
    };
    loadData(); // Call the function that handles async operations
  }, [provider]);

  useEffect(() => {
    const loadData = async () => {
      if (contract) {
        console.log("Loading candidate data...");
        await loadCandidateData();
      }
    };
    loadData(); // Call the function that handles async operations
  }, [contract, provider]);
  
  const votecandidate = async (candidateid) => {
    try {
      setLoader(true);
  
      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }
  
      const tx = await contract.vote(candidateid);
      
      await tx.wait();
      console.log("Vote successful");
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setLoader(false);
    }
  };
  

  const calculateTimeLeft = () => {
    const difference = startTime * 1000 + votingDuration * 1000 - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / (1000 * 60)) % 60),
        sec: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime, votingDuration]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval}>
        <h4 className="ml-3 mt-3">
          {timeLeft[interval]} {interval}
        </h4>
      </div>
    );
  });

  if (loader) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar account={currentAccount} startTime={startTime} />
      <div className="d-flex justify-content-center align-items-center">
        <h4 className="mt-3">Time left:</h4>
        {timerComponents.length ? timerComponents : <h2 className="text-danger ml-3 mt-3">Time's up!</h2>}
      </div>
      <Body CandidateList={candidateList} votecandidate={votecandidate} account={currentAccount} />
    </div>
  );
}

export default VotingPage;
