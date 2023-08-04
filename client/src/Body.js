import React, {useState} from 'react'

const Body = ({CandidateList, votecandidate, account}) => {
    const [Candidate, setCandidate] = useState("");

// Removing duplicate
    const uniqueIds = [];
    const FinalCandidateList = CandidateList.filter(element => {
    const isDuplicate = uniqueIds.includes(element.id);
    if (!isDuplicate) {
      uniqueIds.push(element.id);
      return true;
    }
    return false;
    });

    const onchange = (e) => {
        setCandidate(e.target.value);
        console.log(e.target.value);
    };

    const onsubmit = (e) => {
        e.preventDefault();
        if(Candidate.id !== 0) votecandidate(Number(Candidate));
        else window.alert("there is error in submission");
    };

  return (
    <div className="mt-4 text-center" style={{color: "#000000"}}>
        <h2>Election Results</h2>
        <hr 
            style={{
                width: "70%",
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "#000000",
            }}
        />
        <div className="p-3 ml-auto mr-auto" style={{width: "40%"}}>
            <div className="row ml-auto mr-auto mb-2" style={{width: "90%"}}>
                <div className="col">
                    <p className="font-weight-bold">Id</p>
                </div>
                <div className="col">
                    <p className="font-weight-bold">Name</p>
                </div>
                <div className="col">
                    <p className="font-weight-bold">Votes</p>
                </div>
            </div>        
            <hr 
                style={{width: "90%", borderStyle: "solid", borderColor: "#000000"}}
            />
                {
                    [...FinalCandidateList].sort((a, b) => b.voteCount - a.voteCount).map((candidates) =>{
                        return (<div key={candidates.voteCount}>
                            <div
                                className="row ml-auto mr-auto mt-2 mb-2"
                                style={{width: "90%"}}
                            >
                                <div className="col">
                                    <p>{candidates.id}</p>
                                </div>
                                <div className="col">
                                    <p>{candidates.name}</p>
                                </div>
                                <div className="col">
                                    <p>{candidates.voteCount}</p>
                                </div>
                            </div>
                            <hr 
                                style={{width: "90%", borderStyle: "solid", borderColor: "#000000"}}
                            />
                        </div>);
                        })   
                }
        </div>
        <div className="my-5 mr-auto ml-auto text-left" style={{width: "70%"}}>
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
        <p className="my-5">
            Your address: <span className="font-weight-bold">{account}</span>
        </p>
    </div>
  )
}

export default Body