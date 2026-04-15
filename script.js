const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const searchBtn = document.getElementById('searchBtn');
const mobileSearch = document.getElementById('mobileSearch');
const backBtn = document.getElementById('backBtn');
const searchInput = document.getElementById('searchInput');
const showMoreBtn = document.getElementById('showMoreBtn');
const videoGrid = document.getElementById('videoGrid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const downloadBtn = document.getElementById('downloadBtn');
const contentTitle = document.getElementById('contentTitle');

const channels = [
  { name: "Song", pic: "pic1.png.jpg", filter: "song" },
  { name: "The sound room", pic: "pic2.png.jpg", filter: "soundroom" },
  { name: "Tunetribe", pic: "pic3.png.jpg", filter: "Tunetribe" },
  { name: "Artestic Music", pic: "pic4.png.jpg", filter: "Artestic" },
  { name: "Sonic stream", pic: "pic5.png.jpg", filter: "sonic" }
];

// ===== VIDEO SECTION START =====

const videoUrls = [
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video1.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video2.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video3.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video4.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video4.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video6.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video7.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video8.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video9.mp4",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video10.mp4",
];

const posterUrls = [
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video1_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video2_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video3_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video4_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video5_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video6_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video7_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video8_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video9_thumb.jpg",
  "https://raw.githubusercontent.com/Maha2001/my_videos/main/video10_thumb.jpg",
];

const videoTitles = [
  "Jeenah Hain",
  "Muhabbat ki h dastan zindagi",
  "Mai hoor hun ",
  "Dhoom Machale",
  "Dil lagaya h doobara",
  "Ishq zah e naseeb",
  "Me yar husn ",
  "Saya bhi tera me hone na du juda",
  "Mere lehje me teri Saada he",
  "Ankhon pe aankhe rakh de"
];

const videos = [];
for (let i = 1; i <= 100; i++) {
  const channel = channels[Math.floor(Math.random() * channels.length)];
  
  videos.push({
    id: i,
    title: videoTitles[i - 1] || `Video ${i}`,
    channel: channel.name,
    channelPic: channel.pic,
    thumbnail: posterUrls[(i - 1) % posterUrls.length],
    views: `${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 9)}M views`,
    time: `${Math.floor(Math.random() * 11) + 1} ${Math.random() > 0.5 ? 'months' : 'days'} ago`,
    duration: `${Math.floor(Math.random() * 10) + 35}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    videoUrl: videoUrls[(i - 1) % videoUrls.length],
    category: channel.filter,
    trending: true,
    subscribed: false,
    watchLater: false,
    liked: 0, // 0 = none, 1 = liked, 2 = disliked - Ye add karo
    likeCount: Math.floor(Math.random() * 500) + 10 // Ye bhi add karo
});
}

// ===== WATCH LATER FIX - EVENT DELEGATION =====
videoGrid.addEventListener('click', (e) => {
  const watchBtn = e.target.closest('.watch-later-btn');
  if (!watchBtn) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const videoId = parseInt(watchBtn.dataset.id);
  const video = videos.find(v => v.id === videoId);
  if (!video) return;
  
  video.watchLater = !video.watchLater;
  watchBtn.innerHTML = video.watchLater ? '✓' : '🕒';
  
  let watchLaterList = JSON.parse(localStorage.getItem('watchLater') || '[]');
  if (video.watchLater) {
    if (!watchLaterList.includes(videoId)) watchLaterList.push(videoId);
  } else {
    watchLaterList = watchLaterList.filter(id => id !== videoId);
  }
  localStorage.setItem('watchLater', JSON.stringify(watchLaterList));
});
// ===== WATCH LATER FIX END =====

let currentFilter = 'all';

function renderVideos() {
  let filteredVideos = videos;
    if (currentFilter === 'liked') {
    filteredVideos = videos.filter(v => v.liked === 1);
  } else if (currentFilter !== 'all') {
      filteredVideos = videos.filter(v => v.category === currentFilter);
  }

  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = '<div class="empty-msg">No videos found</div>';
    return;
  }

  videoGrid.innerHTML = filteredVideos.map(video => `
    <div class="video-card" data-id="${video.id}">
      <div class="thumbnail-container">
        <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" onerror="this.src='https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'">
        <span class="duration">${video.duration}</span>
        <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px; z-index: 5;">
          ${video.watchLater ? '✓' : '🕒'}
        </button>
      </div>
      <div class="video-info">
        <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}" onerror="this.src='https://i.pravatar.cc/150'">
        <div class="video-details">
          <h3 class="video-title">${video.title}</h3>
          <div style="display: flex; gap: 8px; margin: 8px 0;">
  <button class="like-btn" data-id="${video.id}" style="background: ${video.liked === 1 ? '#065fd4' : '#f2f2f2'}; color: ${video.liked === 1 ? 'white' : '#0f0f0f'}; border: none; padding: 6px 12px; border-radius: 18px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
    👍 ${video.likeCount}
  </button>
  <button class="dislike-btn" data-id="${video.id}" style="background: ${video.liked === 2 ? '#065fd4' : '#f2f2f2'}; color: ${video.liked === 2 ? 'white' : '#0f0f0f'}; border: none; padding: 6px 12px; border-radius: 18px; font-size: 13px; cursor: pointer;">
    👎
  </button>
</div>
          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
            <div>
              <p class="channel-name">${video.channel} ✓</p>
              <p class="video-stats">${video.views} • ${video.time}</p>
            </div>
            <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 500; font-size: 14px; cursor: pointer; white-space: nowrap;">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', (e) => {
    if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn') && !e.target.closest('.like-btn') && !e.target.closest('.dislike-btn')) {
        playVideo(parseInt(card.dataset.id));
      }
    });
  });

  handleSubscribe();
  handleLikeDislike();
}

function playVideo(id) {
  const video = videos.find(v => v.id === id);
  if (!video) return;
  // History mein save karo
  let history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
  history = history.filter(hId => hId !== id);
  history.unshift(id);
  if (history.length > 50) history.pop();
  localStorage.setItem('watchHistory', JSON.stringify(history));
  
  videoPlayer.src = video.videoUrl;
  videoPlayer.load();
  modalTitle.textContent = video.title;
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  videoPlayer.play();
  
  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = video.title.replace(/[^a-z0-9]/gi, '_') + '.mp4';
    a.click();
  };
}

closeModal.addEventListener('click', () => {
  videoModal.classList.remove('active');
  videoPlayer.pause();
  videoPlayer.src = '';
  document.body.style.overflow = 'auto';
});

videoModal.addEventListener('click', (e) => {
  if (e.target === videoModal) {
    closeModal.click();
  }
});

// ===== VIDEO SECTION END =====

// ===== SEARCH FUNCTIONALITY START =====

function performSearch(searchValue) {
  const searchTerm = searchValue.toLowerCase().trim();
  
  if (searchTerm === "") {
    currentFilter = 'all';
    contentTitle.textContent = "Recommended";
    renderVideos();
    return;
  }
  
  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm) || 
    v.channel.toLowerCase().includes(searchTerm)
  );
  
  contentTitle.textContent = `Search results for "${searchValue}"`;
  
  if (filteredVideos.length === 0) {
    videoGrid.innerHTML = '<div class="empty-msg">No videos found for "' + searchValue + '"</div>';
  } else {
    videoGrid.innerHTML = filteredVideos.map(video => `
      <div class="video-card" data-id="${video.id}">
        <div class="thumbnail-container">
          <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" onerror="this.src='https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'">
          <span class="duration">${video.duration}</span>
          <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px; z-index: 5;">
            ${video.watchLater ? '✓' : '🕒'}
          </button>
        </div>
        <div class="video-info">
          <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}" onerror="this.src='https://via.placeholder.com/36'">
          <div class="video-details">
            <h3 class="video-title">${video.title}</h3>
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
              <div>
                <p class="channel-name">${video.channel} ✓</p>
                <p class="video-stats">${video.views} • ${video.time}</p>
              </div>
              <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 500; font-size: 14px; cursor: pointer; white-space: nowrap;">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn')) {
          playVideo(parseInt(card.dataset.id));
        }
      });
    });
    handleSubscribe();
  }
}

searchBtn.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    mobileSearch.classList.add('active');
    document.querySelector('.search-input-mobile').focus();
  } else {
    performSearch(searchInput.value);
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch(searchInput.value);
  }
});

const searchBtnMobile = document.querySelector('.search-btn-mobile');
const searchInputMobile = document.querySelector('.search-input-mobile');

searchBtnMobile.addEventListener('click', () => {
  performSearch(searchInputMobile.value);
  mobileSearch.classList.remove('active');
});

searchInputMobile.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch(searchInputMobile.value);
    mobileSearch.classList.remove('active');
  }
});

backBtn.addEventListener('click', () => {
  mobileSearch.classList.remove('active');
  searchInputMobile.value = '';
});

// ===== SEARCH FUNCTIONALITY END =====

// ===== SIDEBAR FILTER START =====

const sidebarItems = document.querySelectorAll('.sidebar-item[data-filter]');

sidebarItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    currentFilter = item.getAttribute('data-filter');
    
    const filterText = item.querySelector('.text').textContent;
    if (currentFilter === 'all') {
      contentTitle.textContent = 'Recommended';
    } else {
      contentTitle.textContent = filterText;
    }
    
    renderVideos();
    
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
});

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
});

// ===== SIDEBAR FILTER END =====

// ===== SIGN IN MODAL START =====
const signinBtn = document.querySelector('.signin-btn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');

signinBtn.addEventListener('click', () => {
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
});

closeLoginModal.addEventListener('click', () => {
  loginModal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    closeLoginModal.click();
  }
});

loginSubmitBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  if (email.trim() === '') {
    alert('Please enter email');
    return;
  }
  alert('Welcome ' + email + '! Demo login successful');
  closeLoginModal.click();
  
  signinBtn.innerHTML = '<span>👤</span>';
  signinBtn.style.background = '#f2f2f2';
  signinBtn.style.border = 'none';
});
// ===== SIGN IN MODAL END =====

// ===== 3 DOT MENU START =====
const menuDotsBtn = document.getElementById('menuDotsBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
const appearanceBtn = document.getElementById('appearanceBtn');
const settingsBtn = document.getElementById('settingsBtn');
const helpBtn = document.getElementById('helpBtn');

menuDotsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdownMenu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!menuDotsBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('active');
  }
});

let isDark = false;
appearanceBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isDark = !isDark;
  if (isDark) {
    document.body.style.background = '#0f0f0f';
    document.body.style.color = '#f1f1f1';
    document.querySelector('.header').style.background = '#0f0f0f';
    document.querySelector('.sidebar').style.background = '#0f0f0f';
    appearanceBtn.innerHTML = '<span>☀️</span> Appearance: Dark';
  } else {
    document.body.style.background = '#f9f9f9';
    document.body.style.color = '#0f0f0f';
    document.querySelector('.header').style.background = 'white';
    document.querySelector('.sidebar').style.background = 'white';
    appearanceBtn.innerHTML = '<span>🌙</span> Appearance: Light';
  }
  dropdownMenu.classList.remove('active');
});

settingsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Settings page coming soon!');
  dropdownMenu.classList.remove('active');
});

helpBtn.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Help: Koi masla hai to batao!');
  dropdownMenu.classList.remove('active');
});
// ===== 3 DOT MENU END =====

// ===== SUBSCRIBE LOGIC START =====
function handleSubscribe() {
  document.querySelectorAll('.subscribe-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = parseInt(btn.dataset.id);
      const video = videos.find(v => v.id === videoId);
      
      videos.forEach(v => {
        if (v.channel === video.channel) {
          v.subscribed = !video.subscribed;
        }
      });
      
      const subscribedChannels = videos.filter(v => v.subscribed).map(v => v.channel);
      localStorage.setItem('subscribedChannels', JSON.stringify([...new Set(subscribedChannels)]));
      
      renderVideos();
    });
  });
}

function loadSubscriptions() {
  const saved = JSON.parse(localStorage.getItem('subscribedChannels') || '[]');
  videos.forEach(v => {
    if (saved.includes(v.channel)) {
      v.subscribed = true;
    }
  });
}

function loadWatchLater() {
  const savedWatchLater = JSON.parse(localStorage.getItem('watchLater') || '[]');
  videos.forEach(v => {
    if (savedWatchLater.includes(v.id)) v.watchLater = true;
  });
}

// Subscriptions button
const subBtn = document.querySelector('[data-filter="subscriptions"]');

if (subBtn) {
  subBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    subBtn.classList.add('active');
    
    const subVideos = videos.filter(v => v.subscribed === true);
    
    contentTitle.textContent = 'Subscriptions';
    
    if (subVideos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 40px; color: #606060;">No videos found<br><span style="font-size: 14px;">Subscribe to channels to see videos here</span></p>';
    } else {
      videoGrid.innerHTML = subVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
          <div class="thumbnail-container">
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" onerror="this.src='https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'">
            <span class="duration">${video.duration}</span>
            <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px; z-index: 5;">
              ${video.watchLater ? '✓' : '🕒'}
            </button>
          </div>
          <div class="video-info">
            <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}" onerror="this.src='https://i.pravatar.cc/150'">
            <div class="video-details">
              <h3 class="video-title">${video.title}</h3>
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
                <div>
                  <p class="channel-name">${video.channel} ✓</p>
                  <p class="video-stats">${video.views} • ${video.time}</p>
                </div>
              <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; ...">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn') && !e.target.closest('.like-btn') && !e.target.closest('.dislike-btn')) {
            playVideo(parseInt(card.dataset.id));
          }
        });
      });
      handleSubscribe();
      handleLikeDislike();
    }
    
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
}
function handleLikeDislike() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = parseInt(btn.dataset.id);
      const video = videos.find(v => v.id === videoId);
      
      if (video.liked === 1) {
        video.liked = 0;
        video.likeCount--;
      } else {
        if (video.liked === 2) video.liked = 0;
        video.liked = 1;
        video.likeCount++;
      }
      
      saveLikedVideos();
      renderVideos();
    });
  });

  document.querySelectorAll('.dislike-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoId = parseInt(btn.dataset.id);
      const video = videos.find(v => v.id === videoId);
      
      if (video.liked === 2) {
        video.liked = 0;
      } else {
        if (video.liked === 1) video.likeCount--;
        video.liked = 2;
      }
      
      saveLikedVideos();
      renderVideos();
    });
  });
}

function saveLikedVideos() {
  const likedIds = videos.filter(v => v.liked === 1).map(v => v.id);
  localStorage.setItem('likedVideos', JSON.stringify(likedIds));
}

function loadLikedVideos() {
  const saved = JSON.parse(localStorage.getItem('likedVideos') || '[]');
  videos.forEach(v => {
    if (saved.includes(v.id)) v.liked = 1;
  });
}



// Trending button
const trendingBtn = document.querySelector('[data-filter="trending"]');

if (trendingBtn) {
  trendingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    trendingBtn.classList.add('active');
    
    const trendingVideos = videos.filter(v => v.trending === true);
    
    contentTitle.textContent = 'Trending';
    
    if (trendingVideos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 40px; color: #606060;">No trending videos<br><span style="font-size: 14px;">Check back later</span></p>';
    } else {
      videoGrid.innerHTML = trendingVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
          <div class="thumbnail-container">
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" onerror="this.src='https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'">
            <span class="duration">${video.duration}</span>
            <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px; z-index: 5;">
              ${video.watchLater ? '✓' : '🕒'}
            </button>
          </div>
          <div class="video-info">
            <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}" onerror="this.src='https://i.pravatar.cc/150'">
            <div class="video-details">
              <h3 class="video-title">${video.title}</h3>
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
                <div>
                  <p class="channel-name">${video.channel} ✓</p>
                  <p class="video-stats">${video.views} • ${video.time}</p>
                </div>
                <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 500; font-size: 14px; cursor: pointer; white-space: nowrap;">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn')) {
            playVideo(parseInt(card.dataset.id));
          }
        });
      });
      handleSubscribe();
    }
    
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
}
// Liked videos button
const likedBtn = document.querySelector('[data-filter="liked"]');
if (likedBtn) {
  likedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    likedBtn.closest('.sidebar-item').classList.add('active');
    
    currentFilter = 'liked';
    contentTitle.textContent = 'Liked videos';
    
    const likedVideos = videos.filter(v => v.liked === 1);
    
    if (likedVideos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 40px; color: #606060;">No liked videos<br><span style="font-size: 14px;">Videos you like will appear here</span></p>';
    } else {
      renderVideos();
    }
  });
}

// History button
const historyBtn = document.querySelector('[data-filter="history"]');

if (historyBtn) {
  historyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    historyBtn.classList.add('active');
    
    const historyIds = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const historyVideos = historyIds.map(id => videos.find(v => v.id === id)).filter(v => v);
    
    contentTitle.textContent = 'History';
    
    if (historyVideos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 40px; color: #606060;">No watch history<br><span style="font-size: 14px;">Videos you watch will show up here</span></p>';
    } else {
      videoGrid.innerHTML = historyVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
          <div class="thumbnail-container">
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}" onerror="this.src='https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'">
            <span class="duration">${video.duration}</span>
            <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px; z-index: 5;">
              ${video.watchLater ? '✓' : '🕒'}
            </button>
          </div>
          <div class="video-info">
            <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}" onerror="this.src='https://i.pravatar.cc/150'">
            <div class="video-details">
              <h3 class="video-title">${video.title}</h3>
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
                <div>
                  <p class="channel-name">${video.channel} ✓</p>
                  <p class="video-stats">${video.views} • ${video.time}</p>
                </div>
                <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 500; font-size: 14px; cursor: pointer; white-space: nowrap;">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn')) {
            playVideo(parseInt(card.dataset.id));
          }
        });
      });
      handleSubscribe();
    }
    
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
}

// Watch Later button
const watchLaterBtn = document.querySelector('[data-filter="watch-later"]');

if (watchLaterBtn) {
  watchLaterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    watchLaterBtn.classList.add('active');
    
    const watchLaterIds = JSON.parse(localStorage.getItem('watchLater') || '[]');
    const watchLaterVideos = watchLaterIds.map(id => videos.find(v => v.id === id)).filter(v => v);
    
    contentTitle.textContent = 'Watch Later';
    
    if (watchLaterVideos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; margin-top: 40px; color: #606060;">No videos saved<br><span style="font-size: 14px;">Save videos to watch later</span></p>';
    } else {
      videoGrid.innerHTML = watchLaterVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
          <div class="thumbnail-container">
            <img src="${video.thumbnail}" class="thumbnail" alt="${video.title}">
            <span class="duration">${video.duration}</span>
            <button class="watch-later-btn" data-id="${video.id}" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: none; color: white; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-size: 16px;">✓</button>
          </div>
          <div class="video-info">
            <img src="${video.channelPic}" class="channel-pic" alt="${video.channel}">
            <div class="video-details">
              <h3 class="video-title">${video.title}</h3>
              <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: 4px;"> 
                <div>
                  <p class="channel-name">${video.channel} ✓</p>
                  <p class="video-stats">${video.views} • ${video.time}</p>
                </div>
                <button class="subscribe-btn" data-id="${video.id}" style="background: ${video.subscribed ? '#f2f2f2' : '#0f0f0f'}; color: ${video.subscribed ? '#0f0f0f' : 'white'}; border: none; padding: 8px 16px; border-radius: 18px; font-weight: 500; font-size: 14px; cursor: pointer; white-space: nowrap;">${video.subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.video-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.subscribe-btn') && !e.target.closest('.watch-later-btn')) {
            playVideo(parseInt(card.dataset.id));
          }
        });
      });
      handleSubscribe();
    }
    
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
}

// Page load hote hi sab chala do - Sirf ek baar
loadSubscriptions();
loadWatchLater();
renderVideos();

// ===== SUBSCRIBE LOGIC END ====
// ===== SIDEBAR SHOW MORE START =====
const sidebarShowMoreBtn = document.getElementById('sidebarShowMoreBtn');
const sidebarExtraItems = document.querySelector('.sidebar-extra-items');
let sidebarExpanded = false;

if (sidebarShowMoreBtn) {
  sidebarShowMoreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sidebarExpanded = !sidebarExpanded;
    
    if (sidebarExpanded) {
      sidebarExtraItems.style.display = 'block';
      sidebarShowMoreBtn.querySelector('.icon').textContent = '⌃';
      sidebarShowMoreBtn.querySelector('.text').textContent = 'Show less';
    } else {
      sidebarExtraItems.style.display = 'none';
      sidebarShowMoreBtn.querySelector('.icon').textContent = '⌄';
      sidebarShowMoreBtn.querySelector('.text').textContent = 'Show more';
    }
  });
}
// ===== SIDEBAR SHOW MORE END =====
// Page load hote hi sab chala do - Sirf ek baar
loadSubscriptions();
loadWatchLater();
loadLikedVideos();
renderVideos();