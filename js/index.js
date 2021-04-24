

const gloAcademyList = document.querySelector('.glo-academy-list');
const trandingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');
const navMenuMore = document.querySelector('.nav-menu-more');
const showMore = document.querySelector('.show-more');
const formSearch = document.querySelector('.form-search');
const navMenuSubscriptions = document.querySelector('.nav-menu-subscriptions');

const createCard = (dataVideo) => {
  const imgUrl = dataVideo.snippet.thumbnails.high.url;
  const videoId =
    typeof dataVideo.id === 'string' ? dataVideo.id : dataVideo.id.videoId;
  const titleVideo = dataVideo.snippet.title;
  const viewCount = dataVideo.statistics?.viewCount;
  const dateVideo = dataVideo.snippet.publishedAt;
  const channelTitle = dataVideo.snippet.channelTitle;

  const card = document.createElement('div');
  card.classList.add('video-card');
  card.innerHTML = `

              <div class="video-thumb">
                <a
                  class="link-video youtube-modal"
                  href="https://youtu.be/${videoId}"
                >
                  <img src="${imgUrl}" alt="" class="thumbnail" />
                </a>
              </div>
              <!-- /.video-thumb -->
              <h3 class="video-title">
                ${titleVideo}
              </h3>
              <div class="video-info">
                <span class="video-counter">
                ${
                  viewCount
                    ? `<span class="video-views">${viewCount} views</span>`
                    : ''
                }

                  <span class="video-date">${new Date(dateVideo).toLocaleString(
                    'ru-RU',
                  )}</span>
                </span>
                <span class="video-channel">${channelTitle}</span>
              </div>
              <!-- /.video-info -->

              `;

  return card;
};

const createList = (wrapper, listVideo) => {
  wrapper.textContent = '';
  listVideo.forEach((item) => wrapper.append(createCard(item)));
};


const createMenuSubscriptionsItem = (item) => {
  console.log(item);
  const menuItem = document.createElement('li');
  menuItem.classList.add('nav-item');
  menuItem.innerHTML = `
  <a href="https://youtu.be/${item.snippet.resourceId.channelId}">
    <img
      src="${item.snippet.thumbnails.default.url}"
      alt="Photo: ${item.snippet.title}"
      class="nav-image"
    />
    <span class="nav-text">${item.snippet.title}</span>
  </a>`;
  return menuItem;
};

const createMenuSubscriptions = (data) => {
  console.log(data);
  navMenuSubscriptions.textContent = '';
  data.forEach((item) =>
    navMenuSubscriptions.append(createMenuSubscriptionsItem(item)),
  );
};


// youTube API
const authBtn = document.querySelector('.auth-btn');
const userAvatar = document.querySelector('.user-avatar');

const handleSuccessAuth = (data) => {
  authBtn.classList.add('hide');
  userAvatar.classList.remove('hide');
  userAvatar.src = data.getImageUrl();
  userAvatar.alt = data.getName();

  requestSubscriptions((data) => {
    console.log(data);
    createMenuSubscriptions(data);
  });

    // requestMusic((data) => {
    //   createList(musicList, data);
    // });
};

const handleNoAuth = () => {
  authBtn.classList.remove('hide');
  userAvatar.classList.add('hide');
  userAvatar.src = '';
  userAvatar.alt = '';
};

const handleAuth = () => {
  gapi.auth2.getAuthInstance().signIn();
};

const handleSignout = () => {
  gapi.auth2.getAuthInstance().signOut();
};

const updateStatusAuth = (data) => {
  data.isSignedIn.listen(() => {
    updateStatusAuth(data);
  });
  if (data.isSignedIn.get()) {
    const userData = data.currentUser.get().getBasicProfile();
    handleSuccessAuth(userData);
  } else {
    handleNoAuth();
  }
};

const initClient = () => {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
      ],
    })
    .then(() => {
      updateStatusAuth(gapi.auth2.getAuthInstance());
      authBtn.addEventListener('click', handleAuth);
      userAvatar.addEventListener('click', handleSignout);
    })
    .then(loadScreen)
    .catch((e) => {
      console.warn(e);
    });
};

gapi.load('client:auth2', initClient);

const getCannel = () => {
  gapi.client.youtube.channels
    .list({
      part: 'snippet, contentDetails, statistics',
      id: 'UCVswRUcKC-M35RzgPRv8qUg',
    })
    .execute((response) => {});
};

const requestVideos = (channelId, callback, maxResults = 6) => {
  gapi.client.youtube.search
    .list({
      part: 'snippet',
      channelId,
      maxResults,
      order: 'date',
    })
    .execute((response) => {
      callback(response.items);
    });
};

const requestTrending = (callback, maxResults = 6) => {
  gapi.client.youtube.videos
    .list({
      part: 'snippet, statistics',
      chart: 'mostPopular',
      regionCode: 'RU',
      maxResults,
    })
    .execute((response) => {
      callback(response.items);
    });
};

const requestMusic = (callback, maxResults = 6) => {
  gapi.client.youtube.videos
    .list({
      part: 'snippet, statistics',
      chart: 'mostPopular',
      regionCode: 'RU',
      maxResults,
      videoCategoryId: '10',
    })
    .execute((response) => {
      callback(response.items);
    });
};

const requestSearch = (searchText, callback, maxResults = 6) => {
  gapi.client.youtube.search
    .list({
      q: searchText,
      part: 'snippet',
      maxResults,
      order: 'relevance',
    })
    .execute((response) => {
      callback(response.items);
    });
};

const requestSubscriptions = (callback, maxResults = 3) => {
  gapi.client.youtube.subscriptions
    .list({
      mine: true,
      part: 'snippet',
      maxResults,
      order: 'unread',
    })
    .execute((response) => {
      console.log(response.items);
      callback(response.items);
    });
};
const loadScreen = () => {
  requestVideos('UCVswRUcKC-M35RzgPRv8qUg', (data) => {
    createList(gloAcademyList, data);
  });
  requestTrending((data) => {
    createList(trandingList, data);
  });
  requestMusic((data) => {
    createList(musicList, data);
  });
};

showMore.addEventListener('click', (event) => {
  event.preventDefault();
  navMenuMore.classList.toggle('nav-menu-more-show');
});

formSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = formSearch.elements.search.value;
  requestSearch(value, (data) => {
    createList(gloAcademyList, data);
  });
});

