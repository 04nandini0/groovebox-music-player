/* =========================================================
   Groovebox — Spotify-style Web Player UI clone
   script.js — vanilla JavaScript (ES6+)
   Built by Nandini Sharma for learning purposes
   ========================================================= */

// -----------------------------------------------------------
// 1. SONG DATA
// -----------------------------------------------------------
// TODO: Add your own songs here — replace image/audio paths
// with your own files inside assets/images and assets/audio.
const songs = [
  { id: 1,  title: "Midnight Drive",     artist: "Aarav Mehta",     album: "Neon Skies",      image: "assets/images/cover-1.svg",  audio: "assets/audio/sample-1.wav", category: "recent" },
  { id: 2,  title: "Golden Hour",        artist: "Priya Nair",      album: "Golden Hour",     image: "assets/images/cover-2.svg",  audio: "assets/audio/sample-2.wav", category: "recent" },
  { id: 3,  title: "City Lights",        artist: "Kabir Rao",       album: "Downtown",        image: "assets/images/cover-3.svg",  audio: "assets/audio/sample-3.wav", category: "recent" },
  { id: 4,  title: "Ocean Drift",        artist: "Meera Iyer",      album: "Tidewater",       image: "assets/images/cover-4.svg",  audio: "assets/audio/sample-4.wav", category: "recent" },
  { id: 5,  title: "Afterglow",          artist: "Rohan Verma",     album: "Afterglow",       image: "assets/images/cover-5.svg",  audio: "assets/audio/sample-5.wav", category: "recent" },
  { id: 6,  title: "Paper Planes",       artist: "Ishaan Kapoor",   album: "Paper Planes",    image: "assets/images/cover-6.svg",  audio: "assets/audio/sample-6.wav", category: "madeForYou" },
  { id: 7,  title: "Velvet Sky",         artist: "Ananya Joshi",    album: "Velvet Sky",      image: "assets/images/cover-7.svg",  audio: "assets/audio/sample-1.wav", category: "madeForYou" },
  { id: 8,  title: "Solstice",           artist: "Dev Malhotra",    album: "Solstice",        image: "assets/images/cover-8.svg",  audio: "assets/audio/sample-2.wav", category: "madeForYou" },
  { id: 9,  title: "Echo Chamber",       artist: "Nisha Bhatt",     album: "Echo Chamber",    image: "assets/images/cover-9.svg",  audio: "assets/audio/sample-3.wav", category: "madeForYou" },
  { id: 10, title: "Northern Lights",    artist: "Vivaan Chauhan",  album: "Northern Lights", image: "assets/images/cover-10.svg", audio: "assets/audio/sample-4.wav", category: "trending" },
  { id: 11, title: "Static Bloom",       artist: "Tara Sengupta",   album: "Static Bloom",    image: "assets/images/cover-1.svg",  audio: "assets/audio/sample-5.wav", category: "trending" },
  { id: 12, title: "Amber Road",         artist: "Arjun Khanna",    album: "Amber Road",      image: "assets/images/cover-2.svg",  audio: "assets/audio/sample-6.wav", category: "trending" },
  { id: 13, title: "Glasshouse",         artist: "Sara Fernandes",  album: "Glasshouse",      image: "assets/images/cover-3.svg",  audio: "assets/audio/sample-1.wav", category: "trending" },
];

// Playlists shown under "Made For You" as cards, and in sidebar list
const playlists = [
  { id: "p1", title: "Discover Weekly",  description: "Fresh picks based on what you play", image: "assets/images/cover-6.svg" },
  { id: "p2", title: "Chill Focus",      description: "Calm beats to help you concentrate", image: "assets/images/cover-7.svg" },
  { id: "p3", title: "Weekend Warmup",   description: "Start your weekend right",           image: "assets/images/cover-8.svg" },
  { id: "p4", title: "Late Night Drive", description: "Songs for the road after dark",       image: "assets/images/cover-9.svg" },
];

const sidebarPlaylistNames = [
  "Road Trip Anthems", "Study Beats", "90s Throwback", "Workout Mix",
  "Rainy Day", "Coffee Shop Jazz", "Late Night Vibes", "Party Starters",
];

// -----------------------------------------------------------
// 2. STATE
// -----------------------------------------------------------
const LIKED_SONGS_KEY = "groovebox_liked_songs";

const state = {
  queue: songs,          // current playable queue (changes with search)
  currentIndex: -1,      // index of currently loaded song within `queue`
  isPlaying: false,
  likedIds: loadLikedSongs(),
};

// -----------------------------------------------------------
// 3. DOM REFERENCES
// -----------------------------------------------------------
const audioPlayer = document.getElementById("audioPlayer");

const recentlyPlayedGrid = document.getElementById("recentlyPlayedGrid");
const madeForYouGrid = document.getElementById("madeForYouGrid");
const trendingGrid = document.getElementById("trendingGrid");
const likedGrid = document.getElementById("likedGrid");
const likedEmptyState = document.getElementById("likedEmptyState");
const likedCountEl = document.getElementById("likedCount");
const playlistListEl = document.getElementById("playlistList");

const dashboardView = document.getElementById("dashboardView");
const searchResults = document.getElementById("searchResults");
const searchResultsGrid = document.getElementById("searchResultsGrid");
const searchEmptyState = document.getElementById("searchEmptyState");
const searchInput = document.getElementById("searchInput");

const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerLikeBtn = document.getElementById("playerLikeBtn");

const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");
const volumeBar = document.getElementById("volumeBar");

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

let isShuffle = false;
let isRepeat = false;

// -----------------------------------------------------------
// 4. RENDERING
// -----------------------------------------------------------

/** Build a single music card element for a song */
function createSongCard(song) {
  const card = document.createElement("article");
  card.className = "music-card";
  card.dataset.songId = song.id;

  const isLiked = state.likedIds.includes(song.id);

  card.innerHTML = `
    <div class="music-card__art">
      <!-- TODO: Replace with your own album image -->
      <img src="${song.image}" alt="${song.album} cover" loading="lazy" />
      <button class="music-card__like ${isLiked ? "liked" : ""}" aria-label="Like ${song.title}">
        <svg viewBox="0 0 24 24"><path d="M12 21s-6.7-4.35-9.3-8.1C.8 10 1.4 6.4 4.4 4.9c2.2-1.1 4.6-.4 6 1.3l1.6 1.9 1.6-1.9c1.4-1.7 3.8-2.4 6-1.3 3 1.5 3.6 5.1 1.7 8-2.6 3.75-9.3 8.1-9.3 8.1z"/></svg>
      </button>
      <button class="music-card__play" aria-label="Play ${song.title}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
    <p class="music-card__title">${song.title}</p>
    <p class="music-card__subtitle">${song.artist}</p>
  `;

  // Clicking the card (or its play button) plays the song
  card.addEventListener("click", (e) => {
    if (e.target.closest(".music-card__like")) return; // handled separately
    playSongById(song.id);
  });

  // Like / unlike button
  const likeBtn = card.querySelector(".music-card__like");
  likeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLike(song.id);
  });

  return card;
}

/** Build a playlist card element (Made For You section) */
function createPlaylistCard(playlist) {
  const card = document.createElement("article");
  card.className = "music-card";

  card.innerHTML = `
    <div class="music-card__art">
      <img src="${playlist.image}" alt="${playlist.title} cover" loading="lazy" />
      <button class="music-card__play" aria-label="Play ${playlist.title}">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
    <p class="music-card__title">${playlist.title}</p>
    <p class="music-card__subtitle">${playlist.description}</p>
  `;

  // For this UI demo, playing a "playlist" just queues its matching category
  card.addEventListener("click", () => {
    const first = songs.find((s) => s.category === "madeForYou");
    if (first) playSongById(first.id);
  });

  return card;
}

function renderDashboard() {
  // Recently played
  recentlyPlayedGrid.innerHTML = "";
  songs.filter((s) => s.category === "recent").forEach((song) => {
    recentlyPlayedGrid.appendChild(createSongCard(song));
  });

  // Made for you (playlists)
  madeForYouGrid.innerHTML = "";
  playlists.forEach((pl) => madeForYouGrid.appendChild(createPlaylistCard(pl)));

  // Trending
  trendingGrid.innerHTML = "";
  songs.filter((s) => s.category === "trending").forEach((song) => {
    trendingGrid.appendChild(createSongCard(song));
  });

  renderLikedSongs();
}

function renderLikedSongs() {
  const likedSongs = songs.filter((s) => state.likedIds.includes(s.id));
  likedGrid.innerHTML = "";
  likedCountEl.textContent = likedSongs.length ? `(${likedSongs.length})` : "";

  if (likedSongs.length === 0) {
    likedEmptyState.hidden = false;
    return;
  }
  likedEmptyState.hidden = true;
  likedSongs.forEach((song) => likedGrid.appendChild(createSongCard(song)));
}

function renderSidebarPlaylists() {
  playlistListEl.innerHTML = "";
  sidebarPlaylistNames.forEach((name) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = name;
    li.appendChild(a);
    playlistListEl.appendChild(li);
  });
}

/** Highlight the card that matches the currently playing song */
function updatePlayingCardHighlight() {
  document.querySelectorAll(".music-card").forEach((card) => {
    const id = Number(card.dataset.songId);
    card.classList.toggle("playing", id === getCurrentSong()?.id);
  });
}

// -----------------------------------------------------------
// 5. LIKE FUNCTIONALITY (LocalStorage)
// -----------------------------------------------------------
function loadLikedSongs() {
  try {
    const raw = localStorage.getItem(LIKED_SONGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read liked songs from localStorage:", err);
    return [];
  }
}

function saveLikedSongs() {
  try {
    localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(state.likedIds));
  } catch (err) {
    console.warn("Could not save liked songs to localStorage:", err);
  }
}

function toggleLike(songId) {
  if (state.likedIds.includes(songId)) {
    state.likedIds = state.likedIds.filter((id) => id !== songId);
  } else {
    state.likedIds.push(songId);
  }
  saveLikedSongs();

  // Update every like button for this song currently in the DOM
  document.querySelectorAll(`.music-card[data-song-id="${songId}"] .music-card__like`)
    .forEach((btn) => btn.classList.toggle("liked", state.likedIds.includes(songId)));

  if (getCurrentSong()?.id === songId) {
    playerLikeBtn.classList.toggle("liked", state.likedIds.includes(songId));
  }

  renderLikedSongs();
}

// -----------------------------------------------------------
// 6. AUDIO PLAYER (HTML5 Audio API)
// -----------------------------------------------------------
function getCurrentSong() {
  return state.queue[state.currentIndex] || null;
}

function loadSong(song) {
  audioPlayer.src = song.audio;
  playerCover.src = song.image;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  playerLikeBtn.classList.toggle("liked", state.likedIds.includes(song.id));
  seekBar.value = 0;
  seekBar.style.setProperty("--fill", "0%");
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = "0:00";
}

function playSongById(songId) {
  const index = state.queue.findIndex((s) => s.id === songId);
  if (index === -1) return;
  state.currentIndex = index;
  loadSong(state.queue[index]);
  play();
  updatePlayingCardHighlight();
}

function play() {
  const song = getCurrentSong();
  if (!song) return;

  audioPlayer.play()
    .then(() => {
      state.isPlaying = true;
      updatePlayButtonUI();
    })
    .catch((err) => {
      // Autoplay restrictions or missing file — fail gracefully
      console.warn("Playback could not start:", err);
    });
}

function pause() {
  audioPlayer.pause();
  state.isPlaying = false;
  updatePlayButtonUI();
}

function togglePlayPause() {
  if (state.currentIndex === -1) {
    // Nothing loaded yet — start with the first song in the queue
    if (state.queue.length) playSongById(state.queue[0].id);
    return;
  }
  state.isPlaying ? pause() : play();
}

function updatePlayButtonUI() {
  playIcon.hidden = state.isPlaying;
  pauseIcon.hidden = !state.isPlaying;
  playBtn.classList.toggle("is-playing", state.isPlaying);
}

function playNext() {
  if (!state.queue.length) return;
  let nextIndex;
  if (isShuffle) {
    nextIndex = Math.floor(Math.random() * state.queue.length);
  } else {
    nextIndex = (state.currentIndex + 1) % state.queue.length;
  }
  state.currentIndex = nextIndex;
  loadSong(state.queue[nextIndex]);
  play();
  updatePlayingCardHighlight();
}

function playPrev() {
  if (!state.queue.length) return;
  // If more than 3 seconds into the song, restart it instead of going back
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  const prevIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
  state.currentIndex = prevIndex;
  loadSong(state.queue[prevIndex]);
  play();
  updatePlayingCardHighlight();
}

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// -----------------------------------------------------------
// 7. AUDIO EVENT LISTENERS
// -----------------------------------------------------------
audioPlayer.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audioPlayer.duration);
  seekBar.max = audioPlayer.duration || 0;
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;
  currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  seekBar.value = audioPlayer.currentTime;
  const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  seekBar.style.setProperty("--fill", `${pct}%`);
});

audioPlayer.addEventListener("ended", () => {
  if (isRepeat) {
    audioPlayer.currentTime = 0;
    play();
  } else {
    playNext();
  }
});

// -----------------------------------------------------------
// 8. CONTROL BUTTON LISTENERS
// -----------------------------------------------------------
playBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "var(--color-accent)" : "";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "var(--color-accent)" : "";
});

playerLikeBtn.addEventListener("click", () => {
  const song = getCurrentSong();
  if (song) toggleLike(song.id);
});

seekBar.addEventListener("input", () => {
  const pct = (seekBar.value / (seekBar.max || 1)) * 100;
  seekBar.style.setProperty("--fill", `${pct}%`);
});

seekBar.addEventListener("change", () => {
  audioPlayer.currentTime = Number(seekBar.value);
});

volumeBar.addEventListener("input", () => {
  audioPlayer.volume = Number(volumeBar.value) / 100;
  volumeBar.style.setProperty("--fill", `${volumeBar.value}%`);
});

// Set initial volume from the slider's default value
audioPlayer.volume = Number(volumeBar.value) / 100;

// -----------------------------------------------------------
// 9. SEARCH FUNCTIONALITY
// -----------------------------------------------------------
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchResults.hidden = true;
    dashboardView.hidden = false;
    return;
  }

  const matches = songs.filter((song) =>
    song.title.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query) ||
    song.album.toLowerCase().includes(query)
  );

  dashboardView.hidden = true;
  searchResults.hidden = false;
  searchResultsGrid.innerHTML = "";

  if (matches.length === 0) {
    searchEmptyState.hidden = false;
  } else {
    searchEmptyState.hidden = true;
    matches.forEach((song) => searchResultsGrid.appendChild(createSongCard(song)));
    state.queue = matches; // searching updates the play queue so next/prev cycle through results
  }

  updatePlayingCardHighlight();
});

// -----------------------------------------------------------
// 10. NAVIGATION (Home / Search / Library links)
// -----------------------------------------------------------
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    const view = link.dataset.view;
    if (view === "search") {
      searchInput.focus();
    } else {
      // Home / Library both return to the dashboard view for this demo
      searchInput.value = "";
      searchResults.hidden = true;
      dashboardView.hidden = false;
      state.queue = songs;
    }
    closeMobileSidebar();
  });
});

document.getElementById("likedSongsLink").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("likedGrid").scrollIntoView({ behavior: "smooth", block: "start" });
  closeMobileSidebar();
});

document.getElementById("createPlaylistBtn").addEventListener("click", () => {
  const name = prompt("Name your new playlist:", "My Playlist #" + (sidebarPlaylistNames.length + 1));
  if (name && name.trim()) {
    sidebarPlaylistNames.unshift(name.trim());
    renderSidebarPlaylists();
  }
});

// -----------------------------------------------------------
// 11. MOBILE SIDEBAR TOGGLE
// -----------------------------------------------------------
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

function closeMobileSidebar() {
  sidebar.classList.remove("open");
}

document.addEventListener("click", (e) => {
  const isMobile = window.innerWidth <= 680;
  if (!isMobile) return;
  if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    closeMobileSidebar();
  }
});

// -----------------------------------------------------------
// 12. TOP HEADER BACK/FORWARD (cosmetic history nav)
// -----------------------------------------------------------
document.getElementById("navBack").addEventListener("click", () => history.back());
document.getElementById("navForward").addEventListener("click", () => history.forward());

// -----------------------------------------------------------
// 13. PROFILE BUTTON (placeholder action)
// -----------------------------------------------------------
document.getElementById("profileBtn").addEventListener("click", () => {
  // TODO: Add your own profile/account menu here
  alert("Profile menu — customize this with your own account options.");
});

// -----------------------------------------------------------
// 14. INITIALIZE APP
// -----------------------------------------------------------
function init() {
  renderSidebarPlaylists();
  renderDashboard();
  volumeBar.style.setProperty("--fill", `${volumeBar.value}%`);
}

init();
