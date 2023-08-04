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
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying Metamask !");
    }
  };

  const loadBlockchainData = async () => {
    try {
      if (!provider) {
        return;
      }
      const signer = provider.getSigner();
      const contractAddress = '0x458C1Ad6b1EfEc0bb5661A4ef80356C2DA63d001';
      const deployedContract = new ethers.Contract(contractAddress, ABI.abi, signer);
      setContract(deployedContract);
  
      const accounts = await provider.listAccounts();
      const account = accounts[0];
      setCurrentAccount(account);  
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  }; 
  
  const loadCandidateData = async (contract) => {
    try {
      console.log("here");
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
      // setLoader(false);
    } catch (error) {
      console.error("Error loading candidate data:", error);
    }
  };
  
  

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);
  useEffect(() => {
    console.log(candidateList);
  }, [candidateList]);
  useEffect(() => {
    if (contract) {  
      loadCandidateData(contract);
    }
  }, [contract]);


  const votecandidate = async (candidateid) => {
    try {
      setLoader(true);
      const tx = await contract.vote(candidateid);
      await tx.wait();
      console.log("successfully ran");
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
