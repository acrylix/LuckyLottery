const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'witness crime pattern polar wheel seek orbit physical gossip bamboo flavor student',
  'https://rinkeby.infura.io/CmB80zoaR3RrzvcHzDHi'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x'+bytecode, arguments: ['Hello'] })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
