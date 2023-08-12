import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ABI from '../contracts/Election.sol/Election.json';

const BlockchainContext = createContext();

export const useBlockchainContext = () => {
  return useContext(BlockchainContext);
};

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Listen for account changes and update the currentAccount state
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0] || ''); // Set to the first account or empty string if no account
      });
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying Metamask !");
    }
  };

  const loadBlockchainData = async () => {
    try {
      if (provider) {
        const signer = provider.getSigner();
        const contractAddress = '0x4e72fbE777b4Af6F5B773F9f14f7a25b4AF60a9D';
        const deployedContract = new ethers.Contract(contractAddress, ABI.abi, signer);
        setContract(deployedContract);

        // Get the initial account and set it to currentAccount
        const accounts = await provider.listAccounts();
        setCurrentAccount(accounts[0] || ''); // Set to the first account or empty string if no account
      }
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, [provider]);

  const contextValue = {
    provider,
    contract,
    currentAccount,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
    </BlockchainContext.Provider>
  );
};
