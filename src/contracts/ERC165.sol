// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC165.sol";

contract ERC165 is IERC165 {
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor() {
        registerInterface(bytes4(keccak256('_supportedInterfaces(bytes4)')));
    }

    function supportsInterface(bytes4 interfaceID)
        external
        view
        override
        returns (bool)
    {
        return _supportedInterfaces[interfaceID];
    }

    //registering interfaces(comes from within)

    function registerInterface(bytes4 interfaceID) public {
        require(interfaceID != 0xffffffff, "ERC165 VALUE IS INVALID REQUEST");
        _supportedInterfaces[interfaceID] = true;
    }
}
