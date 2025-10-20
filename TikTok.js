function showLoading() {
  document.getElementById('loading').classList.add('active');
  document.getElementById('results').innerHTML = '';
}

function hideLoading() {
  document.getElementById('loading').classList.remove('active');
}

async function waitForVideosToLoad(videos) {
  const loadPromises = videos.map(video => {
    return new Promise((resolve) => {
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA
        resolve();
      } else {
        const onLoaded = () => {
          video.removeEventListener('loadeddata', onLoaded);
          resolve();
        };
        video.addEventListener('loadeddata', onLoaded);
        // Fallback timeout
        setTimeout(resolve, 10000); // 10s timeout
      }
    });
  });
  await Promise.all(loadPromises);
}

async function searchTikTok() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsContainer = document.getElementById('results');

  if (!query) {
    hideLoading();
    resultsContainer.innerHTML = `<div style="text-align:center; color:#ff5555; padding-top:50px;">Please enter a keyword.</div>`;
    return;
  }

  showLoading();

  const apiUrl = `Your API URL here`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.data || !data.data.videos.length) {
      hideLoading();
      resultsContainer.innerHTML = `<div style="text-align:center; color:#999; padding-top:50px;">No videos found.</div>`;
      return;
    }

    resultsContainer.innerHTML = "";
    const cards = [];
    const videos = [];

    data.data.videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="video-info">
          <div class="video-header">
            <img class="author-avatar" src="${video.author.avatar}" alt="author">
            <div class="author-details">
              <div class="author-username">@${video.author.unique_id}</div>
              <div class="author-bio">${video.author.nickname || 'Creator'}</div>
            </div>
          </div>
          <h3 class="video-title">${video.title || "Untitled Video"}</h3>
          <p class="video-description">${video.desc || 'No description available.'}</p>
          <div class="video-player">
            <video src="${video.play}" controls>
              <div class="video-overlay">▶</div>
            </video>
          </div>
        </div>
      `;
      cards.push(card);
      const vidElement = card.querySelector('video');
      videos.push(vidElement);
    });

    // Append all cards first
    cards.forEach(card => resultsContainer.appendChild(card));

    // Wait for all videos to load
    await waitForVideosToLoad(videos);

    // Now hide loading
    hideLoading();

  } catch (err) {
    hideLoading();
    resultsContainer.innerHTML = `<div style="text-align:center; color:#ff5555; padding-top:50px;">Error: ${err.message}</div>`;
  }
}
