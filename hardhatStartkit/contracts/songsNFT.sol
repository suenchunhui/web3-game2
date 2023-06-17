//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./test/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

 contract songsNFT is ERC721Royalty , Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string[]) public _words;
    address public wordsAddress;
    using Strings for uint256;

    constructor(address _wordsAddress) public ERC721("Songs-NFT", "SNFT") {
        wordsAddress = _wordsAddress;
    }
    // TODO: SET UP : META DATA SERVER.


    function mintSong(address _callerAddress,string[] memory _butchOfStrings) public {
        require(msg.sender == wordsAddress,'No Words Contract');
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _words[newItemId] = _butchOfStrings;
        _mint(_callerAddress, newItemId);
    }


    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }

     function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
       // _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

   function join(string[] memory _strings) internal pure returns (string memory) {
        string memory _separator = " ";
        if (_strings.length == 0) return "";
        if (_strings.length == 1) return _strings[0];
        
        uint256 length = 0;
        for (uint256 i = 0; i < _strings.length; i++) {
            length += bytes(_strings[i]).length;
            if (i < _strings.length - 1) length += bytes(_separator).length;
        }
        
        bytes memory result = new bytes(length);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _strings.length; i++) {
            bytes memory strBytes = bytes(_strings[i]);
            for (uint256 j = 0; j < strBytes.length; j++) {
                result[index++] = strBytes[j];
            }
            
            if (i < _strings.length - 1) {
                bytes memory sepBytes = bytes(_separator);
                for (uint256 j = 0; j < sepBytes.length; j++) {
                    result[index++] = sepBytes[j];
                }
            }
        }
        
        return string(result);
    }

   function tokenURL(uint256 _tokenId) external view returns (string memory) {
       // (string memory _symbolString) =this._words(_tokenId);
        string memory _symbolString = join(_words[_tokenId]);
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
                        '<rect id="rectangle" height="500" width="500" rx="25" ry="25"/>',
                        '<text x="50%" y="52%" font-weight="bold" font-family="Monospace" dominant-baseline="middle" fill="hsl(0, 100%, 36%)" text-anchor="middle" font-size="20">',
                        _name,
                        "</text>"
                        "</svg>"
                    )
                )
            );
    }    
}