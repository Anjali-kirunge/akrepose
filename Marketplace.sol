// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ReentrancyGuard, Ownable {
    uint256 public itemCount;
    struct Item {
        uint256 itemId;
        IERC721 nft;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => Item) public items;

    event Offered(
        uint256 indexed itemId,
        address indexed nft,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event Bought(
        uint256 indexed itemId,
        address indexed nft,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    function makeItem(IERC721 _nft, uint256 _tokenId, uint256 _price) external nonReentrant {
        require(_price > 0, "Price must be > 0");
        itemCount += 1;
        // transfer NFT to marketplace contract
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            payable(msg.sender),
            _price,
            false
        );
        emit Offered(itemCount, address(_nft), _tokenId, msg.sender, _price);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        require(msg.value >= item.price, "Not enough Ether to cover price");
        require(!item.sold, "Item already sold");

        item.seller.transfer(item.price);
        item.sold = true;

        // transfer NFT to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        emit Bought(_itemId, address(item.nft), item.tokenId, msg.sender, item.price);
    }

    // helper to cancel and return NFT to seller (only seller)
    function cancelItem(uint256 _itemId) external nonReentrant {
        Item storage item = items[_itemId];
        require(msg.sender == item.seller, "Only seller can cancel");
        require(!item.sold, "Item already sold");
        item.nft.transferFrom(address(this), item.seller, item.tokenId);
        item.sold = true; // mark as unavailable
    }
}
