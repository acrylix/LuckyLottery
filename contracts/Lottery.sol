pragma solidity ^0.4.19;

contract Lottery{
    address public manager;

    address[] public players;

    modifier restricted{
        require(msg.sender==manager);
        _;
    }

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value > 0.1 ether);

        players.push(msg.sender);
    }

    function random() private view returns(uint){
        return uint(sha3(block.difficulty, now, players));
    }

    function pickWinner() public restricted{
        uint index = random() % players.length;

        players[index].transfer(address(this).balance);

        players = new address[](0);
    }

    function getPlayers() public view returns(address[]){
        return players;
    }
}
