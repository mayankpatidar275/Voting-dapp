import React from 'react';
import { BrowserRouter,Route, Routes } from "react-router-dom";
import AdminPage from './AdminPage';
import Home from './Home';
import VotingPage from './VotingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="admin" element={<AdminPage/>}/>
          <Route path="votingPage" element={<VotingPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
