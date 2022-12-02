import React ,{useEffect, useState} from 'react';
import Web3 from 'web3';
import Body from './Body';
import Electionabi from './contracts/Election.json';
import Navbar from './Navbar';

function VotingPage () {

  useEffect(() => {
    loadWeb3();
    LoadBlockchaindata();
  }, [])

  const[Currentaccount, setCurrentaccount] = useState("");
  const[loader, setloader] = useState(true);
  const[Electionsm, SetElectionsm] = useState();
  const [CandidateList, setCandidateList] = useState([]);
  const [startTime, setstartTime] = useState();
  const [votingDuration, setvotingDuration] = useState()

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
      const count = await election.methods.candidatesCount().call();
      // console.log(count);
      console.log("count printed");
      for (let i = 1; i <= count; i++) {
        const candidate = await election.methods.candidates(i).call();
        setCandidateList((CandidateList) => [...CandidateList, candidate]);
      }
      const startTime = await election.methods.startTime().call();
      const votingDuration = await election.methods.votingDuration().call();
      // console.log(startTime);
      setvotingDuration(votingDuration);
      setstartTime(startTime);
      SetElectionsm(election);
      setloader(false);
    } else{
      window.alert("the smart contract is not deployed current network")
    }
  }

  const votecandidate = async(candidateid)=>{
    setloader(true);
    await Electionsm.methods.vote(candidateid).send({from : Currentaccount}).on('transactionhash' ,()=>{
      console.log("successfully ran");
    })
    setloader(false);
  }

  const calculateTimeLeft = () => {
    const difference = +new Date(1000*startTime) + +new Date(1000*votingDuration)  - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <div>
        <h4 className="ml-3 mt-3">
          {timeLeft[interval]} {interval}{" "}
        </h4>
      </div>
    );
  });

  if(loader){
    return <div>Loading...</div>
  }
  return (
    <div>
        <Navbar account = {Currentaccount} startTime = {startTime}/>
        <div className="d-flex justify-content-center align-items-center ">
            <h4 className="mt-3">Time left :</h4>
            {timerComponents.length ? timerComponents : <h2 className="text-danger ml-3 mt-3">Time's up!</h2>}
        </div>
        <Body CandidateList = {CandidateList} votecandidate={votecandidate} account={Currentaccount}/>
    </div>
  );
}

export default VotingPage;
