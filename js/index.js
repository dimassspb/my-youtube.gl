const API_KEY = 'AIzaSyAfFuEw9MRssI_0OwrNiAGlAy2_3xwXh - M';
const CLIENT_ID =
  '406840720605-nio6i0fnbhpi9kkgmt7b52q85fi4o7ec.apps.googleusercontent.com';

const gloAcademyList = document.querySelector('.glo-academy-list');
const trandingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');

const createCard = (dataVideo) => {
  const imgUrl = dataVideo.snippet.thumbnails.high.url;
  const videoId = dataVideo.id.videoId;
  const titleVideo = dataVideo.snippet.title;
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
                  <span class="video-date">${dateVideo}</span>
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

createList(gloAcademyList, gloAcademy);
createList(trandingList, trending);
createList(musicList, music);
