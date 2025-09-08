/*
 Quick frontend connecting to deployed contracts.
 Update the addresses below after deploying with the ones printed by deploy script.
*/

const NFT_ADDRESS = ""; // paste deployed NFT contract address here
const MARKETPLACE_ADDRESS = ""; // paste deployed Marketplace contract address here

let provider;
let signer;
let nftContract;
let marketplaceContract;

async function init() {
  if (!window.ethereum) {
    alert("Please install MetaMask.");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  document.getElementById('connect').onclick = connect;
  document.getElementById('mint').onclick = mintNFT;
  document.getElementById('list').onclick = listNFT;
  document.getElementById('refresh').onclick = loadItems;
}

async function connect() {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  document.getElementById('account').innerText = await signer.getAddress();
  nftContract = new ethers.Contract(NFT_ADDRESS, [
    "function mint(string memory tokenURI) public returns (uint256)",
    "function approve(address to, uint256 tokenId) public",
    "function ownerOf(uint256 tokenId) public view returns (address)"
  ], signer);

  marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, [
    "function makeItem(address nft, uint256 tokenId, uint256 price) external",
    "function itemCount() view returns (uint256)",
    "function items(uint256) view returns (uint256,address,uint256,address,uint256,bool)",
    "function purchaseItem(uint256) external payable"
  ], signer);

  loadItems();
}

async function mintNFT() {
  const uri = document.getElementById('tokenURI').value.trim();
  if (!uri) { alert("Enter token URI"); return; }
  const tx = await nftContract.mint(uri);
  await tx.wait();
  alert("Minted (check console for token ID - this simple ABI doesn't return tokenId)");
}

async function listNFT() {
  const tokenId = parseInt(document.getElementById('tokenId').value);
  const priceInEth = document.getElementById('price').value;
  if (!tokenId || !priceInEth) { alert("Enter tokenId and price"); return; }
  const priceWei = ethers.utils.parseEther(priceInEth);
  // approve first
  const approveTx = await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);
  await approveTx.wait();
  const tx = await marketplaceContract.makeItem(NFT_ADDRESS, tokenId, priceWei);
  await tx.wait();
  alert("Listed for sale");
  loadItems();
}

async function loadItems() {
  try {
    const count = await marketplaceContract.itemCount();
    const c = count.toNumber();
    const list = document.getElementById('items');
    list.innerHTML = '';
    for (let i = 1; i <= c; i++) {
      const it = await marketplaceContract.items(i);
      // items: itemId, nft, tokenId, seller, price, sold
      const sold = it[5];
      if (sold) continue;
      const li = document.createElement('li');
      li.innerText = `Item ${it[0].toString()} — NFT ${it[1]} token ${it[2].toString()} — seller ${it[3]} — price ${ethers.utils.formatEther(it[4].toString())} ETH`;
      const buyBtn = document.createElement('button');
      buyBtn.innerText = 'Buy';
      buyBtn.onclick = async () => {
        const tx = await marketplaceContract.purchaseItem(it[0], { value: it[4] });
        await tx.wait();
        alert('Purchase complete');
        loadItems();
      };
      li.appendChild(buyBtn);
      list.appendChild(li);
    }
  } catch (e) {
    console.error(e);
  }
}

window.addEventListener('load', init);
