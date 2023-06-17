pragma solidity ^0.8.0;

contract Leaderboard {

    function verifyWinning(/*uint a0, uint a1, uint[2] memory b0, uint[2] memory b1, uint c0, uint c1*/) public {
        //check season started
        require(inSeason, "Not in season");

        // //parse input from persistent answer hash
        // uint[2] memory inputValues;
        // inputValues[0] = answer >> 128;
        // inputValues[1] = answer & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

        // //perform ZK verification
        // Proof memory proof = Proof(
        //     Pairing.G1Point(a0, a1),
        //     Pairing.G2Point(b0, b1),
        //     Pairing.G1Point(c0, c1)
        // );
        
        // require(verifyTx(proof, inputValues), "Failed ZKP");

        //set winners' list
        winners[winner_count] = msg.sender;
        emit verifiedWinner(msg.sender, winner_count);

        winner_count++;
    }

    event verifiedWinner(address winner, uint32 place);

    function startSeason(uint256 _answer, uint256 _prizeCap) public {
        require(msg.sender == owner);
        require(!inSeason);
        answer = _answer;
        prizeCap = _prizeCap;
        inSeason = true;
        winner_count = 0;
    }

    function seasonPrize() public view returns (uint256) {
        if(!inSeason)
            return 0;
        else if(address(this).balance < prizeCap)
            return address(this).balance;
        else
            return prizeCap;
    }

    function endSeason() public {
        require(msg.sender == owner);
        require(inSeason);

        uint256 prize = seasonPrize();
        inSeason = false;

        for(uint32 i=0;i<winner_count;i++){
            uint256 winnerShare = prize * 1000 / 300;
            payable(winners[i]).transfer(winnerShare);
            prize -= winnerShare;
        }
    }

    // non zokrates data
    address public owner = msg.sender;
    mapping(uint32 => address) public winners;
    uint256 public answer;
    uint256 public prizeCap;
    uint32 public winner_count;
    bool public inSeason;

    uint256 public constant prizeRatio = 300;

}
