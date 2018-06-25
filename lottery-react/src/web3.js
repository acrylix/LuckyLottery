import Web3 from 'web3';

// metamask injects web3 into global window
const web3 = new Web3(window.web3.currentProvider);

export default web3;
