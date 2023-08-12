// CastVote.js
import React, { useState } from 'react';
import { useBlockchainContext } from '../context/BlockchainContext';


const CastVote = ({ FinalCandidateList }) => {
  const [Candidate, setCandidate] = useState("");
  const { contract } = useBlockchainContext();

  const votecandidate = async (candidateid) => {
    try {
    //   setLoader(true);
  
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
    //   setLoader(false);
    }
  };

  const onchange = (e) => {
    setCandidate(e.target.value);
    console.log(e.target.value);
  };

  const onsubmit = (e) => {
    e.preventDefault();
    if (Candidate.id !== 0) votecandidate(Number(Candidate));
    else window.alert("there is an error in submission");
  };

  return (
      <div className="my-5 mr-auto ml-auto text-left" style={{ width: "70%" }}>
                <h5>Cast Your Vote:</h5>
                <form onSubmit={onsubmit}>
                    <select name="candidate" className="form-control" onChange={onchange}>
                        <option defaultValue value="">
                            Select
                        </option>
                        {FinalCandidateList.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>
                                {candidate.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary mt-2 btn-md w-100">
                        Vote Candidate{" "} {Candidate}
                    </button>
                </form>
            </div>
  );
};

export default CastVote;
