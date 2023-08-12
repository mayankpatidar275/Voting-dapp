
import React from 'react';
import BlocksAnimation from '../assets/Blocks.gif';

const VotingResult = ({ FinalCandidateList, loader }) => {
    console.log(loader);

    return (
        <div className="mt-4 text-center" style={{ color: "#000000" }}>
            <h2>Election Results</h2>
            <hr
                style={{
                    width: "70%",
                    borderStyle: "solid",
                    borderWidth: "2px",
                    borderColor: "#000000",
                }}
            />
            <div className="p-3 ml-auto mr-auto" style={{ width: "40%" }}>
                <div className="row ml-auto mr-auto mb-2" style={{ width: "90%" }}>
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
                    style={{ width: "90%", borderStyle: "solid", borderColor: "#000000" }}
                />
                {
                    loader ? (
                        <div className="mt-4 text-center" style={{ color: "#000000" }}>
                            <img src={BlocksAnimation} alt="Loading" />
                        </div>
                    )

                        : ([...FinalCandidateList].sort((a, b) => b.voteCount - a.voteCount).map((candidates) => {
                            return (<div key={candidates.id}>
                                <div
                                    className="row ml-auto mr-auto mt-2 mb-2"
                                    style={{ width: "90%" }}
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
                                    style={{ width: "90%", borderStyle: "solid", borderColor: "#000000" }}
                                />
                            </div>);
                        }))
                }
            </div>


        </div>

    );
};

export default VotingResult;
