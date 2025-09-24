# NFT Marketplace

A modern, responsive NFT marketplace built with Node.js, Web3.js, HTML, CSS, and JavaScript. This application allows users to connect their Ethereum wallet, list NFTs for sale, and purchase unique digital assets.

## ✨ Features

- **Wallet Integration**: Connect Ethereum wallet using MetaMask
- **NFT Management**: List your own NFTs for sale with custom pricing
- **Marketplace**: Browse and purchase NFTs from other users
- **Search Functionality**: Find NFTs by name or owner
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live notifications and status updates
- **Form Validation**: Comprehensive input validation and error handling
- **Modern UI/UX**: Clean, professional interface inspired by OpenSea

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd nft-marketplace
   
   # Or simply download and extract the files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Use

### For Buyers
1. **Connect Wallet**: Click "Connect Wallet" and approve the connection in MetaMask
2. **Browse NFTs**: View available NFTs in the marketplace
3. **Search**: Use the search bar to find specific NFTs
4. **Purchase**: Click "Buy" on any NFT you want to purchase

### For Sellers
1. **Connect Wallet**: Ensure your wallet is connected
2. **List NFT**: Fill out the "List NFT" form with:
   - NFT Name
   - Image URL (must be a valid image URL)
   - Price in ETH
3. **Submit**: Click "List NFT" to add your NFT to the marketplace

## 🛠️ Technical Details

### Backend (Node.js + Express)
- RESTful API endpoints for NFT operations
- CORS enabled for cross-origin requests
- JSON data storage (in-memory for demo purposes)
- Error handling and validation

### Frontend (Vanilla JavaScript + Web3.js)
- Web3.js integration for Ethereum wallet connection
- Responsive CSS Grid and Flexbox layouts
- Real-time notifications system
- Form validation and error handling
- Loading states and user feedback

### API Endpoints
- `GET /api/nfts` - Retrieve all NFTs
- `POST /api/list` - List a new NFT
- `POST /api/buy` - Purchase an NFT

## 🎨 Customization

### Styling
The application uses a modern color scheme with CSS custom properties. You can easily customize:
- Colors in `public/style.css`
- Layout and spacing
- Typography and fonts
- Component styles

### Functionality
- Add more NFT metadata fields
- Implement real blockchain integration
- Add user authentication
- Include image upload functionality
- Add NFT categories and filters

## 🔧 Development

### Project Structure
```
nft-marketplace/
├── public/
│   ├── index.html          # Main page
│   ├── pages/
│   │   ├── about.html      # About page
│   │   └── contact.html    # Contact page
│   ├── style.css           # Main stylesheet
│   └── app.js              # Frontend JavaScript
├── server/
│   └── index.js            # Backend server
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### Adding New Features
1. **Backend**: Add new routes in `server/index.js`
2. **Frontend**: Add new functions in `public/app.js`
3. **Styling**: Update `public/style.css`
4. **Pages**: Create new HTML files in `public/pages/`

## 🐛 Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure MetaMask is installed and unlocked
- Check that you're on a supported network
- Try refreshing the page and reconnecting

**NFT Images Not Loading**
- Verify the image URL is valid and accessible
- Check browser console for CORS errors
- The app includes fallback placeholder images

**Server Not Starting**
- Ensure Node.js is installed
- Check that port 3000 is available
- Run `npm install` to ensure all dependencies are installed

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

This is a demo project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Links

- [MetaMask](https://metamask.io/) - Ethereum wallet
- [Web3.js](https://web3js.readthedocs.io/) - Ethereum JavaScript library
- [Express.js](https://expressjs.com/) - Web framework for Node.js

---

**Note**: This is a demonstration project. For production use, implement proper security measures, database integration, and blockchain smart contracts.