// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract LeaderboardVerifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x090decf407f8f782451cc77ad48264b497e4befb5d6139216ea7da6d52026357), uint256(0x0f0dd03b42908b2c9891e150b1d735052f4660f1b4f03b10b37df7140995ca13));
        vk.beta = Pairing.G2Point([uint256(0x1034f0c7b68d94f1fc5c4f9cbda4b8955668aa8372e116b08c47b1d7f948d100), uint256(0x29cdf6fb36a3a1c802091bbf616f69ffd3456ac006bc5e4020d6a3f0a5fa67df)], [uint256(0x1b6494baaa28fa8af35003e23d41bb7a761bc8fdf58cfbbca8e29874258da4ef), uint256(0x02448ac92db02d8cde73328faa48a522c08dd1379d923bc057d531f964699a8b)]);
        vk.gamma = Pairing.G2Point([uint256(0x3038840f7c63f5a038aa5167bdc1afe4b57db860999a17c58b77645c4e53d0e9), uint256(0x1e824d0673a7e50f8ddb3e834ecfaedb0508ca61051df86499a52b34e8131731)], [uint256(0x0a0ec42d3d66898298ee7c1e01730fd6557f3576f6d1c9c39dbf93d2498b3fd0), uint256(0x0552591a6e774991d6b769dcd991868f0104114f9f815e5a6ba76b109477d08e)]);
        vk.delta = Pairing.G2Point([uint256(0x02b3f0f4f2e070882a84440bfc7f068b1a73e4f51920c4f6b75737637170a154), uint256(0x1ec1d6bb382f1fd188263e9f5a2b9b8c6890fa901880b4411bd58cc1aee8e37e)], [uint256(0x092c8bc2b9bf8b0b184b752a45453a9070fcfcc3b79d44b6de08911db4232ccd), uint256(0x0a607bcbcacf4659c87436937d28e05420e5505f3f55fb7fd7c66327053739ad)]);
        vk.gamma_abc = new Pairing.G1Point[](3);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x0aa6fd4482a46da5447493a49ec00cc737f78006b4343d921adac8efb7b1f712), uint256(0x1b9e1f0f6684b0957aaa2dce1fde879109ebaa4dad9fb879b36eeb0105a0e106));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x05cf74acfd66641bb7bd4c200627f4093866027b81cb7cb3131f80e2bba7e541), uint256(0x055edf83dc1e51b51cc04b654212e3b967966494ab6082f59d3f910d482b1016));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x2490850e5a4734bfd875d5149c7ee6daa284681347cde4ad72135605c5c77619), uint256(0x0022a72515becce6531e0d68c0588ac4df006b980d1da05aebc13511afb06068));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[2] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](2);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}

contract Leaderboard is LeaderboardVerifier {

    function verifyWinning(uint a0, uint a1, uint[2] memory b0, uint[2] memory b1, uint c0, uint c1) public {
        //check season started
        require(inSeason, "Not in season");

        //parse input from persistent answer hash
        uint[2] memory inputValues;
        inputValues[0] = answer >> 128;
        inputValues[1] = answer & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

        //perform ZK verification
        Proof memory proof = Proof(
            Pairing.G1Point(a0, a1),
            Pairing.G2Point(b0, b1),
            Pairing.G1Point(c0, c1)
        );
        
        require(verifyTx(proof, inputValues), "Failed ZKP");

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
