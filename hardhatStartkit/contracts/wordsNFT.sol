//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "./test/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
interface IsongsNFT {
    function mintSong(address _callerAddress , string[] memory _butchOfStrings)
        external;
}

contract wordsNFT is ERC1155Burnable, Ownable
{ 
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    string[] public mnemonics = ["The","Wooden", "Love", "Ship", "Geniuses", "Wonderful", "Happy"];
    mapping(uint256 => string) public _words;
    using Strings for uint256;
    event burnedWords( string[] );
    address public songsAddress;

    constructor() public ERC1155("https://game.example/api/item/{id}.json") {
     }

    function setupSongsNFT( address _songsAddress) public onlyOwner{
        songsAddress = _songsAddress;
    }

    function payToMint() external payable {
        
    uint256 salt = 3;
     for (uint256 i=0; i < 6; ++i) {
        uint256 random =  (block.timestamp * salt * i) % mnemonics.length;
        console.log(random);
        _mint(msg.sender, i, 1, "");
        }
        // Send ETH back..
        address payable _newAddress = payable(msg.sender);
        _newAddress.transfer(msg.value); 
   }

    function superMintTo(address _receiver, uint256 _id , uint256 _amount) public payable{
         _mint(_receiver, _id, _amount, "TEST");
    }

    function produceSong(uint256[] memory ids) public {
        uint256 len = ids.length;
        uint256[] memory _tokenIDs = new uint256[](len);
        string[] memory _symbolStrings = new string[](len);
        /// TODO : Check for uniqueness in ids..
        for (uint256 i=0; i < len; ++i) {
            _tokenIDs[i]=1;
            _symbolStrings[i]=mnemonics[ids[i]];
            require(balanceOf(msg.sender, ids[i])>= 1, 'no balance');
        }
        _burnBatch(msg.sender,ids, _tokenIDs);
        // Call songs NFT
        IsongsNFT(songsAddress).mintSong(msg.sender , _symbolStrings);
        emit burnedWords(_symbolStrings);
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
                                '{"name":"Words NFT # ',
                                (_tokenId).toString(),
                                '", "description":" Words NFT",',
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
                        '<rect id="rectangle" height="500" width="500" rx="25" ry="25"/>',
                        '<text x="50%" y="52%" font-weight="bold" font-family="Monospace" dominant-baseline="middle" fill="hsl(206, 100%, 36%)" text-anchor="middle" font-size="60">',
                        _name,
                        "</text>"
                        "</svg>"
                    )
                )
            );
    }
}