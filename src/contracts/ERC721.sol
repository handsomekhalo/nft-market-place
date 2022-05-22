// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ERC165.sol";
import "./interfaces/IERC721.sol";

/*
    Build  a mint function , 
    a/nft to point to an address
    b.keep track of token id
    c. keep track of token owner address to token id
    d. keep track of how many tokens an owne address has
    e. crate event that emits a tranfer log - contract address , where it is being mnted to the id;
*/
contract ERC721 is ERC165, IERC721 {
    //mapping in solidity cretaes a hash table in key pair values
    //mapping from token id to owner

    //  address public minter;
    // event Sent (address from ,address to , uint256, amount);

    mapping(uint256 => address) private _tokenOwner;

    //from owner to number of owned tokens
    mapping(address => uint256) private _ownedTokensCount;

    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        registerInterface(
            bytes4(
                keccak256("balanceOf(bytes4)") ^
                    keccak256("ownerOf(bytes4)") ^
                    keccak256("transferFrom(bytes4)")
            )
        );
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        require(_owner != address(0), "owner query for non-existent token");
        return _ownedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view override returns (address) {
        address owner = _tokenOwner[_tokenId];
        require(owner != address(0), "owner query for non-existent address");
        return owner;
    }

    //setting address of NFT Owner to check the mapping
    //of the address from the token owner at token id;
    function _exists(uint256 tokenId) internal view returns (bool) {
        address owner = _tokenOwner[tokenId];
        //returns trurhinss that the address is not zero
        return owner != address(0);
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        //requires address is not zero
        require(to != address(0), "ERC721: Minting to the zero address");

        //requriee address does not already exist
        require(!_exists(tokenId), "ERC721: Token already minted");
        //adding new address with a token id for minting
        _tokenOwner[tokenId] = to;

        //keeping track of each address that is minting and adding on to count
        _ownedTokensCount[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(
            _to != address(0),
            "Error - ERC721 Transfer to the zero address"
        );
        require(
            ownerOf(_tokenId) == _from,
            "Trying to tranfer to a non-existant address"
        );
        _tokenOwner[_tokenId] = _to;

        _ownedTokensCount[_from] -= 1;

        _ownedTokensCount[_to] += 1;

        _ownedTokensCount[_from] = _ownedTokensCount[_to];

        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public override {
        require(isApprovedOrOwner(msg.sender, _tokenId));
        _transferFrom(_from, _to, _tokenId);
    }

    //REQUIRE PERSON APPROVING IS OWNER
    //approve an address to a token
    //require that you cant send toekns of onwner to owner
    //update map of approval addressess
    function approve(address _to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(_to != owner, "Error , Approval to current owner");
        require(msg.sender == owner, "Current caller is not the owner");
        _tokenApprovals[tokenId] = _to;

        emit Approval(owner, _to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        require(_exists(tokenId), "Token does not exist");
        address owner = ownerOf(tokenId);
        return (spender == owner);
    }

    //check wether functions is approved or
}
