// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./interfaces/IERC721Enumerable.sol";

contract ERC721Enumerable is IERC721Enumerable, ERC721 {
    uint256[] private _allTokens;


    //mapping from token id to positions in _alltokens array

    mapping(uint256 => uint256) private _allTokensIndex;
    //mapping of owner to list of all token owner id

    mapping(address => uint256[]) private _ownedTokens;

    //mapping from token ID index of the owner token list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    
    constructor() {
        registerInterface(
            bytes4(
                keccak256("totalSupply(bytes4)") ^
                    keccak256("tokrnByIndex(bytes4)") ^
                    keccak256("tokenOfOwnerByIndex(bytes4)")
            )
        );
    }

    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
        //addtokens to owner
        //add tokens to ttotal supply to all tokens
        _allTokensIndex[tokenId] = _allTokens.length;
        _addTokenToAllEnumeration(tokenId);
        _addTokenToOwnerEnumeration(to, tokenId);
    }

    //add tokens to the add tokens array and sets up the position ofvtoken indxes
    function _addTokenToAllEnumeration(uint256 tokenId) private {
        _allTokens.push(tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        //add address and token id to _ownedTokens

        _ownedTokens[to].push(tokenId);
        //owned tokenIndex toekn id set to address of owned token position
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;

        //execute function with mining
    }

    //functionthat will be searching throughu
    function tokenByIndex(uint256 index)
        public
        view
        override
        returns (uint256)
    {
        //ensure index is not aout of bound of the total supply
        require(index < totalSupply(), "Global index out of bounds!");
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        override
        returns (uint256)
    {
        require(index < balanceOf(owner), "Index index out of bounds!");
        return _ownedTokens[owner][index];
    }

    //returns total supply of the all tokens array
    function totalSupply() public view override returns (uint256) {
        return _allTokens.length;
    }
}
