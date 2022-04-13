import { useEffect, useState } from 'react';

const VALID_CHAIN_ID = '0x4'; // Rinkeby

export function useAccount(ethereum) {
  const [currentAccount, setCurrentAccount] = useState('');
  const [chainId, setChainId] = useState(null);
  useEffect(() => {
    if (!ethereum) {
      return;
    }
    function listenAccount (accounts) {
      console.log('accounts', accounts);
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
      } else {
        setCurrentAccount('');
      }
    }
    function listenChain(chainId) {
      // https://chainlist.org/
      setChainId(chainId);
    }
      
    ethereum.on('accountsChanged', listenAccount);
    ethereum.on('chainChanged', listenChain);
      
    return () => {
      ethereum.removeListener('accountsChanged', listenAccount);
      ethereum.removeListener('chainChanged', listenChain);
    };
  }, [ethereum]);
  return {currentAccount, chainId, setCurrentAccount, setChainId, isValidChain: chainId === VALID_CHAIN_ID};
}