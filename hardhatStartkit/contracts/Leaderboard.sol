// SPDX-License-Identifier: MIT
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

contract Leaderboard {
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
        vk.alpha = Pairing.G1Point(uint256(0x2e955c2d3025af3e942c6df956c2d19a726ebfaf126a3864598679271fc4d781), uint256(0x0594d26b723e82f273d63deccbf8427265c92fc7029ec8cd36426d7e9b8f85f4));
        vk.beta = Pairing.G2Point([uint256(0x2a662553bfe8f8020a89a0e1a5856051b7d69715a109cb94759a8c815eae07e5), uint256(0x1c0de20b0b9a57237f8aa2ad0d0558879426fbeb864048fb84c4902fef76b1b4)], [uint256(0x04c15a0b12f979a9e798b4b99ebdc09578f2a41203115e38de69748e4bd7af12), uint256(0x2b634b2e6e9c7be2c08a578239608e20b9a62c032a76d5326e845962aafef919)]);
        vk.gamma = Pairing.G2Point([uint256(0x1d0e82748995d8eea1305d20a4eb506348cad619e2029dc829a0fd2754eb9153), uint256(0x2746a21cad55097d6723a8b7d328d69380cb2f6308969399649d05db0ffe4b02)], [uint256(0x019e694f50df527216d617e0215fbcad55f737d8d61cd006acf622891cc096ef), uint256(0x13f4442e9339bec5cca36d6b149e2b85d42255c486e411d1c89fb55207f1c226)]);
        vk.delta = Pairing.G2Point([uint256(0x25b43a264152589039d362a8b9014c03bf1fd3dc2daccd26699b06e5c10667fb), uint256(0x05cb638478bba7516f218832063c84e3622c098899e361c8fad7198a785c2c09)], [uint256(0x0ea656717fa31708fd9e685178f16e269be94e29cce813e9bf480ad8a1d34337), uint256(0x02fbd4ab3bcb20a1db8cadf5698714a4ec089ab60a7ec8630536aea74d6b257c)]);
        vk.gamma_abc = new Pairing.G1Point[](3);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x1d7126e66426aa081664090ea7b8842f7e78a9be2f6cd1f9cfb0f8954132af38), uint256(0x210405bb3ac7dabbf74c73c370678eb7916d77b88016c0e71e01a0da1d09463b));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x1794b8fc53bd77f1b1d1c89624d82a036f228e80bada1ed573c8596accfe4835), uint256(0x13854a332b1626863a095ba6349758873071948d5f610df709c9a4df8968a394));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x24dc7542ed7d6eba0242feac682e3864c17bd2374bdfa1d5ce6b26aeb20e15ca), uint256(0x06f58751bca94452057d979c78e75c6ab19263753d66b494c427887387e95cb7));
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
    function verifyWinning(Proof memory proof) public {
        //check season started
        require(inSeason, "Not in season");

        //parse input from persistent answer hash
        uint[] memory inputValues = new uint[](2);
        inputValues[0] = answer >> 128;
        inputValues[1] = answer & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

        //perform ZK verification        
        require(verify(inputValues, proof) == 0, "Failed ZKP");

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

        for(uint i=0;i<winner_count;i++){
            uint256 winnerShare = prize * 1000 / 300;
            payable(winners[i]).transfer(winnerShare);
            prize -= winnerShare;
        }
    }

    // non zokrates data
    address owner = msg.sender;
    address[] winners;
    uint256 answer;
    uint256 prizeCap;
    uint32 winner_count;
    bool inSeason;

    uint256 public constant prizeRatio = 300;

}
