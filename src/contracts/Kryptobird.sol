// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

//Hook up the ERC721Connector to main NFT SMART CONTRACT

contract KryptoBird is ERC721Connector {

    //array t store our nfts

    string [] public kryptoBirdz;

    mapping(string => bool)_kryptoBirdExists;

    function mint(string memory _kryptoBird)public
    {
        require(!_kryptoBirdExists[_kryptoBird], 'Error - Kryptobird already exits');
      //deprecated  uint _id = kryptoRirdz.push(_kryptoBird);
      kryptoBirdz.push(_kryptoBird);
      uint _id = kryptoBirdz.length-1;
    //.push no longer returns the length but a ref to the added element

    _mint(msg.sender , _id);
    _kryptoBirdExists[_kryptoBird] = true;

    }



    constructor ()ERC721Connector('KryptoBird','KBIRDZ')
    {}
    

}
