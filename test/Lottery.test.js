const assert = require('assert');
const ganache = require('ganache-cli');
// Capical because constructor
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;
const INITIAL_STRING = 'Hello';

beforeEach(async () => {
  // Get list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use an account to deploy contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  lottery.setProvider(provider);
});

describe('lottery', () => {
  it('deploy contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('0.2', 'ether') });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });

    assert(players.length, 1);
    assert(players[0], accounts[0]);
  });

  it('require a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 200 });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }
  });

  it('ownly owner can call pick winner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }
  });

  it('one player one win', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
});
