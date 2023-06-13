//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "./test/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract wordsNFT is ERC1155Burnable
{ 
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    string[] public mnemonics = ["Wooden", "Love", "Ship", "Geniuses", "Wonderful", "Happy" ,"Forks", "Affluent" ,"Subliminal", "Cool", "Yanked","Thick", "Linen", "Like" ,"Juicy" ,"Herbalists", "Dejectedly"];
    mapping(uint256 => string) public _words;
    using Strings for uint256;

    constructor() public ERC1155("https://game.example/api/item/{id}.json") {
     }


    function payToMint() external payable {
        uint256 _id = 6;
        _mint(msg.sender, _id, 1, "");
    }

    function superMintTo(address _receiver, uint256 _id , uint256 _amount) public {
         _mint(_receiver, _id, _amount, "TEST");
    }

    

 
    function tokenURL(uint256 _tokenId) external view returns (string memory) {
       // (string memory _symbolString) =this._words(_tokenId);
        string memory _symbolString = mnemonics[_tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"Songs NFT # ',
                                (_tokenId).toString(),
                                '", "description":"Songs NFT",',
                                "data:image/svg+xml;base64,",
                                buildImage(
                                    _symbolString
                                ),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function buildImage(string memory _name) public pure returns (string memory) {
        return
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                        '<text x="50%" y="52%" font-weight="bold" font-family="Monospace" dominant-baseline="middle" fill="hsl(206, 100%, 36%)" text-anchor="middle" font-size="60">',
                        _name,
                        "</text>"
                        "</svg>"
                    )
                )
            );
    }
}