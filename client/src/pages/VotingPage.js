import React, { useEffect, useState } from 'react';
import { useBlockchainContext } from '../context/BlockchainContext';
import Navbar from '../components/Navbar';
import VotingResult from '../components/VotingResult';
import CastVote from '../components/CastVote';
import TimeLeft from '../components/TimeLeft';

function VotingPage() {
  const [resultLoader, setResultLoader] = useState(true);
  const [timerLoader, setTimerLoader] = useState(true);
  const [candidateList, setCandidateList] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [votingDuration, setVotingDuration] = useState(0);

  const { provider, contract} = useBlockchainContext();

  const loadCandidateData = async () => {
    try {
      if (provider && contract) {
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
        // setTimerLoader(false);
        console.log("loadCandidate after");
      }
    } catch (error) {
      console.error("Error loading candidate data:", error);
    }
  };

  // Removing duplicate
  const uniqueIds = [];
  const FinalCandidateList = candidateList.filter(element => {
    const isDuplicate = uniqueIds.includes(element.id);
    if (!isDuplicate) {
      uniqueIds.push(element.id);
      return true;
    }
    return false;
  });

  useEffect(() => {
    const loadData = async () => {
      if (contract) {
        console.log("Loading candidate data...");
        setTimerLoader(true);
        setResultLoader(true);
        await loadCandidateData();
        setResultLoader(false);
      }
    };
    loadData(); // Call the function that handles async operations
  }, [contract, provider]);

  return (
    <div>
      <Navbar account={"123123123"} startTime={startTime} />
      <TimeLeft startTime={startTime} votingDuration={votingDuration} loader={timerLoader}/>
      <CastVote FinalCandidateList={FinalCandidateList} />
      <VotingResult FinalCandidateList={FinalCandidateList} loader={resultLoader} />
    </div>
  );
}

export default VotingPage;
