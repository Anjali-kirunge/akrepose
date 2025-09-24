const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Pretty URL routes
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/home.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/about.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages/contact.html'));
});
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

// Placeholder for NFT data
let nfts = [
  {
    id: 1,
    name: 'Digital Genesis',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe17cb?w=300&h=300&fit=crop&crop=center',
    price: '0.1',
    owner: '0x000...'
  },
  {
    id: 2,
    name: 'Crypto Art #1',
    image: 'https://images.unsplash.com/photo-1642790105077-0a1cbfe0a56f?w=300&h=300&fit=crop&crop=center',
    price: '0.5',
    owner: '0x111...'
  },
  {
    id: 3,
    name: 'Abstract Dreams',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center',
    price: '0.8',
    owner: '0x222...'
  },
  {
    id: 4,
    name: 'Neon Cityscape',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
    price: '0.3',
    owner: '0x333...'
  },
  {
    id: 5,
    name: 'Cosmic Explorer',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop&crop=center',
    price: '0.7',
    owner: '0x444...'
  },
  {
    id: 6,
    name: 'Digital Waves',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop&crop=center',
    price: '0.4',
    owner: '0x555...'
  }
];

// Get all NFTs
app.get('/api/nfts', (req, res) => {
  res.json(nfts);
});

// Buy NFT
app.post('/api/buy', (req, res) => {
  const { id, buyer } = req.body;
  const nft = nfts.find(n => n.id === id);
  if (nft) {
    nft.owner = buyer;
    res.json({ success: true, nft });
  } else {
    res.status(404).json({ success: false });
  }
});

// List NFT
app.post('/api/list', (req, res) => {
  const { name, image, price, owner } = req.body;
  const id = nfts.length + 1;
  const nft = { id, name, image, price, owner };
  nfts.push(nft);
  res.json({ success: true, nft });
});

// Sell NFT (update price)
app.post('/api/sell', (req, res) => {
  const { id, price, seller } = req.body;
  const nft = nfts.find(n => n.id === id);
  if (nft && nft.owner.toLowerCase() === seller.toLowerCase()) {
    nft.price = price;
    res.json({ success: true, nft });
  } else {
    res.status(403).json({ success: false, message: 'You can only sell your own NFTs' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

app.listen(port, () => {
  console.log(`NFT Marketplace backend running at http://localhost:${port}`);
});
