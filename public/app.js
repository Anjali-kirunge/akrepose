// Carousel logic for auto-scroll and navigation
function initializeCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsNav = carousel.querySelector('.carousel-dots');
  let currentIndex = 0;
  let intervalId = null;

  // Create dots
  dotsNav.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.onclick = () => goToSlide(idx);
    dotsNav.appendChild(dot);
  });

  function updateCarousel() {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === currentIndex ? 'block' : 'none';
    });
    Array.from(dotsNav.children).forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(idx) {
    currentIndex = idx;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function resetAutoplay() {
    if (intervalId) clearInterval(intervalId);
    if (carousel.dataset.autoplay === 'true') {
      intervalId = setInterval(nextSlide, Number(carousel.dataset.interval) || 4000);
    }
  }

  prevBtn.onclick = prevSlide;
  nextBtn.onclick = nextSlide;

  updateCarousel();
  resetAutoplay();
}
let web3;
let userAccount;

window.addEventListener('DOMContentLoaded', () => {
  const connectBtnEl = document.getElementById('connectWallet');
  if (connectBtnEl) connectBtnEl.onclick = connectWallet;
  const listFormEl = document.getElementById('listForm');
  if (listFormEl) listFormEl.onsubmit = listNFT;
  // Removed search binding (search UI removed)
  
  loadNFTs();
  initializeCarousel();
});

async function connectWallet() {
  const connectBtn = document.getElementById('connectWallet');
  const walletAddress = document.getElementById('walletAddress');
  
  if (!window.ethereum) {
    showNotification('Please install MetaMask to use this marketplace!', 'error');
    return;
  }

  try {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    connectBtn.classList.add('loading');

    web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
    
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }
    
      userAccount = accounts[0];
    const shortAddress = `${userAccount.slice(0, 6)}...${userAccount.slice(-4)}`;
    walletAddress.innerText = `Connected: ${shortAddress}`;
    walletAddress.style.display = 'block';
    
    showNotification('Wallet connected successfully!', 'success');
    
    } catch (err) {
    console.error('Wallet connection error:', err);
    let errorMessage = 'Wallet connection failed';
    
    if (err.code === 4001) {
      errorMessage = 'Connection rejected by user';
    } else if (err.code === -32002) {
      errorMessage = 'Connection request already pending';
    }
    
    showNotification(errorMessage, 'error');
  } finally {
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect Wallet';
    connectBtn.classList.remove('loading');
  }
}

async function loadNFTs() {
  const nftList = document.getElementById('nftList');
  if (!nftList) return;
  
  try {
    // Skeleton loading
    nftList.innerHTML = `
      <div class="skeleton-grid">
        ${Array.from({ length: 6 }).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-pill" style="margin-bottom:12px"></div>
            <div class="skeleton-thumb"></div>
            <div class="skeleton-line" style="width:60%"></div>
            <div class="skeleton-line" style="width:40%"></div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const res = await fetch('http://localhost:3000/api/nfts', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const nfts = await res.json();
    nftList.innerHTML = '';
    
    if (nfts.length === 0) {
      nftList.innerHTML = `
        <div class="empty-state">
          <div class="empty-image">
            <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe17cb?w=200&h=200&fit=crop&crop=center" alt="Empty NFT Collection" class="empty-img">
          </div>
          <h3 class="empty-title">No NFTs Available</h3>
          <p class="empty-description">Be the first to list an NFT on our marketplace! Create and showcase your unique digital art.</p>
          <button class="empty-action-btn" onclick="document.getElementById('nftName').focus()">Start Listing</button>
        </div>
      `;
      return;
    }
    
    nfts.forEach((nft, idx) => {
      const div = document.createElement('div');
      div.className = 'nft animate-in';
      const isOwner = userAccount && nft.owner.toLowerCase() === userAccount.toLowerCase();
      const ownerShort = `${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`;
      div.innerHTML = `
        <div class="nft-header">
          <strong>${nft.name}</strong>
          <span class="price-chip">${nft.price} ETH</span>
        </div>
        <img src="${nft.image}" alt="${nft.name}" onerror="this.src='https://via.placeholder.com/300x180?text=NFT'">
        <div class="nft-details">
          <span class="nft-owner">Owner: ${ownerShort}</span>
        </div>
        <div class="nft-actions">
          <button onclick="buyNFT(${nft.id})" ${!userAccount ? 'disabled title="Connect wallet first"' : ''} class="buy-btn">Buy</button>
          ${isOwner ? `<button onclick="sellNFT(${nft.id})" class="sell-btn">Sell</button>` : ''}
        </div>
      `;
      nftList.appendChild(div);
      div.style.animationDelay = `${Math.min(idx * 60, 360)}ms`;
    });
  } catch (error) {
    console.error('Error loading NFTs:', error);
    
    // Show offline mode with sample data
    nftList.innerHTML = `
      <div class="offline-notice">
        <div class="offline-icon">⚠️</div>
        <h3>Server Offline - Demo Mode</h3>
        <p>Showing sample NFTs. Start the server to enable full functionality.</p>
        <button class="retry-btn" onclick="loadNFTs()">Retry Connection</button>
      </div>
      <div class="os-nft-grid">
        ${getSampleNFTs().map((nft, idx) => `
          <div class=\"nft animate-in\" style=\"animation-delay:${Math.min(idx * 60, 360)}ms\"> 
            <div class=\"nft-header\">
              <strong>${nft.name}</strong>
              <span class=\"price-chip\">${nft.price} ETH</span>
            </div>
            <img src="${nft.image}" alt="${nft.name}" onerror="this.src='https://via.placeholder.com/300x180?text=NFT'">
            <div class=\"nft-details\">
              <span class=\"nft-owner\">Owner: ${nft.owner}</span>
            </div>
            <div class="nft-actions">
              <button disabled title="Server offline - Demo mode" class="buy-btn">Buy</button>
              <button disabled title="Server offline - Demo mode" class="sell-btn">Sell</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    showNotification('Server offline - Running in demo mode', 'warning');
  }
}

// Sample NFTs for offline mode
function getSampleNFTs() {
  return [
    {
      id: 1,
      name: 'Digital Genesis',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe17cb?w=300&h=300&fit=crop&crop=center',
      price: '0.1',
      owner: '0x123...abc'
    },
    {
      id: 2,
      name: 'Crypto Art #1',
      image: 'https://images.unsplash.com/photo-1642790105077-0a1cbfe0a56f?w=300&h=300&fit=crop&crop=center',
      price: '0.5',
      owner: '0x456...def'
    },
    {
      id: 3,
      name: 'Abstract Dreams',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop&crop=center',
      price: '0.8',
      owner: '0x789...ghi'
    },
    {
      id: 4,
      name: 'Neon Cityscape',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop&crop=center',
      price: '0.3',
      owner: '0xabc...123'
    },
    {
      id: 5,
      name: 'Cosmic Explorer',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=300&fit=crop&crop=center',
      price: '0.7',
      owner: '0xdef...456'
    },
    {
      id: 6,
      name: 'Digital Waves',
      image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=300&h=300&fit=crop&crop=center',
      price: '0.4',
      owner: '0xghi...789'
    }
  ];
}

async function listNFT(e) {
  e.preventDefault();
  
  if (!userAccount) {
    showNotification('Please connect your wallet first!', 'error');
    return;
  }

  const name = document.getElementById('nftName').value.trim();
  const image = document.getElementById('nftImage').value.trim();
  const price = document.getElementById('nftPrice').value.trim();

  // Form validation
  if (!name) {
    showNotification('Please enter an NFT name', 'error');
    return;
  }
  
  if (!image) {
    showNotification('Please enter an image URL', 'error');
    return;
  }
  
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    showNotification('Please enter a valid price in ETH', 'error');
    return;
  }

  const submitBtn = document.querySelector('#listForm button[type="submit"]');
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Listing...';
    submitBtn.classList.add('loading');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

  const res = await fetch('http://localhost:3000/api/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image, price, owner: userAccount }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

  const result = await res.json();
  if (result.success) {
      showNotification('NFT listed successfully!', 'success');
    loadNFTs();
    document.getElementById('listForm').reset();
  } else {
      showNotification('Listing failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error listing NFT:', error);
    
    // Show demo mode message
    showNotification('Server offline - NFT listing disabled in demo mode', 'warning');
    
    // Add to local demo data
    const newNFT = {
      id: Date.now(),
      name: name,
      image: image,
      price: price,
      owner: userAccount
    };
    
    // Show the NFT in the list (demo mode)
    const nftList = document.getElementById('nftList');
    if (!nftList) return;
    const div = document.createElement('div');
    div.className = 'nft';
    const ownerShort = `${newNFT.owner.slice(0, 6)}...${newNFT.owner.slice(-4)}`;
    div.innerHTML = `
      <div class="nft-header">
        <strong>${newNFT.name}</strong>
        <span class="price-chip">${newNFT.price} ETH</span>
      </div>
      <img src="${newNFT.image}" alt="${newNFT.name}" onerror="this.src='https://via.placeholder.com/300x180?text=NFT'">
      <div class="nft-details">
        <span class="nft-owner">Owner: ${ownerShort}</span>
      </div>
      <div class="nft-actions">
        <button disabled title="Server offline - Demo mode" class="buy-btn">Buy</button>
        <button disabled title="Server offline - Demo mode" class="sell-btn">Sell</button>
      </div>
    `;
    nftList.appendChild(div);
    
    document.getElementById('listForm').reset();
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'List NFT';
    submitBtn.classList.remove('loading');
  }
}

async function buyNFT(id) {
  if (!userAccount) {
    showNotification('Please connect your wallet first!', 'error');
    return;
  }
  try {
    const nftId = Number(id);
    const res = await fetch('http://localhost:3000/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: nftId, buyer: userAccount })
    });
    if (!res.ok) {
      if (res.status === 404) {
        showNotification('NFT not found. Please refresh.', 'error');
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return;
    }
    const result = await res.json();
    if (result.success) {
      showNotification('NFT purchased successfully!', 'success');
      loadNFTs();
    } else {
      showNotification('Purchase failed. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error buying NFT:', error);
    if (error.name === 'AbortError') {
      showNotification('Request timed out. Please try again.', 'error');
    } else {
      showNotification('Failed to purchase NFT. Please try again.', 'error');
    }
  }
}

async function sellNFT(id) {
  if (!userAccount) {
    showNotification('Please connect your wallet first!', 'error');
    return;
  }
  const newPrice = prompt('Enter new price in ETH:');
  if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) {
    showNotification('Please enter a valid price in ETH', 'error');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: Number(id), price: newPrice, seller: userAccount })
    });
    if (!res.ok) {
      if (res.status === 403) {
        showNotification('You can only sell your own NFTs.', 'error');
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return;
    }
    const result = await res.json();
    if (result.success) {
      showNotification('NFT price updated!', 'success');
      loadNFTs();
    } else {
      showNotification('Failed to update price. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error selling NFT:', error);
    showNotification('Failed to update price. Please try again.', 'error');
  }
}

// Removed search functionality

//

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: var(--notification-text);
    font-weight: 600;
    z-index: 1000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
    background: var(--notification-bg-${type}, var(--notification-bg-info));
  `;

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification && notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 4000);
}
