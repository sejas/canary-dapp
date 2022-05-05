import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import ContractJson from '../utils/Canary.json';

const CanaryDetails = {
  // TODO 1: Replace the address with the address of the deployed contract
  CONTRACT_ADDRESS: '0xd44aBFB64B98C13a69839BFF433814446726703A',
  // If you have changed the contract code, you will need to update the ABI file
  CONTRACT_ABI: ContractJson.abi,
};  

export function useContract(ethereum, isValidChain) {
  const [contract, setContract] = useState(null);
  useEffect(() => {
    if (!ethereum || !isValidChain || contract) {
      return;
    }
    // We initialize the contract with the provider and the ABI only once
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const newContract = new ethers.Contract(CanaryDetails.CONTRACT_ADDRESS, CanaryDetails.CONTRACT_ABI, signer);
    setContract(newContract);
  }, [ethereum, contract, isValidChain]);
  return contract;
}