import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BlockchainProvider } from './context/BlockchainContext'; // Update the path accordingly
import AdminPage from './pages/AdminPage';
import Home from './pages/Home';
import VotingPage from './pages/VotingPage';

function App() {
  return (
    <BlockchainProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="votingPage" element={<VotingPage />} />
        </Routes>
      </BrowserRouter>
    </BlockchainProvider>
  );
}

export default App;
