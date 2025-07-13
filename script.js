class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("audioPlayer");
    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.isShuffling = false;
    this.isRepeating = false;
    this.isDarkTheme = true;
    this.currentTime = 0;
    this.duration = 0;

    this.songs = [
      {
        title: "Hamari Adhuri Kahani",
        artist: "Arijit Singh",
        duration: "6:38",
        albumArt: "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/images/img1.jpg",
        audioUrl:
          "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/songs/Hamari%20Adhuri%20Kahani%20-%20Hamari%20Adhuri%20Kahani%20320%20Kbps.mp3"
,
      },
      {
        title: "Main Agar Kahoon",
        artist: "Sonu Nigam and Shrey Ghosal",
        duration: "5:12",
        albumArt: "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/images/img2.jpg",
        audioUrl:
          "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/songs/Main%20Agar%20Kahoon%20-%20Om%20Shanti%20Om%20320%20Kbps.mp3",
      },
      {
        title: "Mere Nishaan",
        artist: "Kailash Kher",
        duration: "5:00",
        albumArt: "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/images/img3.jpg",
        audioUrl:
          "https://raw.githubusercontent.com/amit-kumar-11/Music-Player/main/songs/Mere%20Nishaan%20-%20OMG%20Oh%20My%20God!%20320%20Kbps.mp3",
      }
    ];

    this.initializeElements();
    this.loadCurrentSong();
    this.setupEventListeners();
    this.createPlaylist();
    this.setupNavbarScroll();
  }

  initializeElements() {
    this.playBtn = document.getElementById("playBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.shuffleBtn = document.getElementById("shuffleBtn");
    this.repeatBtn = document.getElementById("repeatBtn");
    this.themeToggle = document.getElementById("themeToggle");
    this.playlistToggle = document.getElementById("playlistToggle");

    this.albumArt = document.getElementById("albumArt");
    this.albumImage = document.getElementById("albumImage");
    this.songTitle = document.getElementById("songTitle");
    this.artistName = document.getElementById("artistName");
    this.playIcon = document.getElementById("playIcon");

    this.currentTimeEl = document.getElementById("currentTime");
    this.totalTimeEl = document.getElementById("totalTime");
    this.progressBar = document.getElementById("progressBar");
    this.progressFill = document.getElementById("progressFill");
    this.progressThumb = document.getElementById("progressThumb");

    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeFill = document.getElementById("volumeFill");
    this.backgroundBlur = document.getElementById("backgroundBlur");

    this.playlist = document.getElementById("playlist");
    this.playlistItems = document.getElementById("playlistItems");

    // Navbar element
    this.navbar = document.querySelector(".navbar");
  }

  setupNavbarScroll() {
    let lastScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
        this.navbar.style.transform = "translateY(-100%)";
      } else {
        this.navbar.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
  }

  setupEventListeners() {
    // Control buttons
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.prevBtn.addEventListener("click", () => this.previousSong());
    this.nextBtn.addEventListener("click", () => this.nextSong());
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat());
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
    this.playlistToggle.addEventListener("click", () => this.togglePlaylist());

    // Album art click
    this.albumArt.addEventListener("click", () => this.togglePlay());

    // Progress bar
    this.progressBar.addEventListener("click", (e) => this.seek(e));
    this.progressBar.addEventListener("mousedown", (e) => this.startDrag(e));

    // Volume control
    this.volumeSlider.addEventListener("input", (e) =>
      this.setVolume(e.target.value)
    );

    // Audio events
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleSongEnd());
    this.audio.addEventListener("loadstart", () => this.handleLoadStart());
    this.audio.addEventListener("canplaythrough", () => this.handleCanPlay());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Mouse events for dragging
    document.addEventListener("mousemove", (e) => this.handleDrag(e));
    document.addEventListener("mouseup", () => this.endDrag());
  }

  loadCurrentSong() {
    const song = this.songs[this.currentSongIndex];

    this.songTitle.style.opacity = "0";
    this.artistName.style.opacity = "0";
    this.albumImage.style.opacity = "0";

    setTimeout(() => {
      this.songTitle.textContent = song.title;
      this.artistName.textContent = song.artist;
      this.albumImage.src = song.albumArt;
      this.totalTimeEl.textContent = song.duration;

      this.backgroundBlur.style.backgroundImage = `url(${song.albumArt})`;

      this.audio.src = song.audioUrl;

      this.songTitle.style.opacity = "1";
      this.artistName.style.opacity = "1";
      this.albumImage.style.opacity = "1";
    }, 300);

    this.updatePlaylistActive();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.playIcon.textContent = "⏸";
        this.albumArt.classList.add("spinning");
        this.animatePlayButton();
      })
      .catch((error) => {
        console.log("Play failed:", error);
      });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playIcon.textContent = "▶";
    this.albumArt.classList.remove("spinning");
  }

  nextSong() {
    if (this.isShuffling) {
      this.currentSongIndex = Math.floor(Math.random() * this.songs.length);
    } else {
      this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    }

    this.loadCurrentSong();
    if (this.isPlaying) {
      setTimeout(() => this.play(), 500);
    }
  }

  previousSong() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else {
      this.currentSongIndex =
        this.currentSongIndex === 0
          ? this.songs.length - 1
          : this.currentSongIndex - 1;
      this.loadCurrentSong();
      if (this.isPlaying) {
        setTimeout(() => this.play(), 500);
      }
    }
  }

  toggleShuffle() {
    this.isShuffling = !this.isShuffling;
    this.shuffleBtn.style.background = this.isShuffling
      ? "var(--accent-gradient)"
      : "var(--glass-bg)";
    this.shuffleBtn.style.color = this.isShuffling
      ? "white"
      : "var(--text-primary)";
  }

  toggleRepeat() {
    this.isRepeating = !this.isRepeating;
    this.repeatBtn.style.background = this.isRepeating
      ? "var(--accent-gradient)"
      : "var(--glass-bg)";
    this.repeatBtn.style.color = this.isRepeating
      ? "white"
      : "var(--text-primary)";
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const body = document.body;

    if (this.isDarkTheme) {
      body.removeAttribute("data-theme");
      this.themeToggle.querySelector(".theme-icon").textContent = "🌙";
    } else {
      body.setAttribute("data-theme", "light");
      this.themeToggle.querySelector(".theme-icon").textContent = "☀️";
    }
  }

  togglePlaylist() {
    this.playlist.style.display =
      this.playlist.style.display === "none" ? "block" : "none";
  }

  seek(event) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const seekTime = percent * this.audio.duration;

    if (seekTime >= 0 && seekTime <= this.audio.duration) {
      this.audio.currentTime = seekTime;
    }
  }

  startDrag(event) {
    this.isDragging = true;
    this.progressBar.style.cursor = "grabbing";
    event.preventDefault();
  }

  handleDrag(event) {
    if (this.isDragging) {
      this.seek(event);
    }
  }

  endDrag() {
    this.isDragging = false;
    this.progressBar.style.cursor = "pointer";
  }

  setVolume(volume) {
    this.audio.volume = volume / 100;
    this.volumeFill.style.width = volume + "%";
  }

  updateProgress() {
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      this.progressFill.style.width = percent + "%";
      this.progressThumb.style.left = percent + "%";

      this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateDuration() {
    this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  handleSongEnd() {
    if (this.isRepeating) {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.nextSong();
    }
  }

  handleLoadStart() {
    this.playBtn.style.opacity = "0.5";
  }

  handleCanPlay() {
    this.playBtn.style.opacity = "1";
  }

  animatePlayButton() {
    this.playBtn.style.transform = "scale(1.1)";
    setTimeout(() => {
      this.playBtn.style.transform = "scale(1)";
    }, 150);
  }

  handleKeyPress(event) {
    switch (event.code) {
      case "Space":
        event.preventDefault();
        this.togglePlay();
        break;
      case "ArrowRight":
        this.nextSong();
        break;
      case "ArrowLeft":
        this.previousSong();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.setVolume(Math.min(100, this.audio.volume * 100 + 5));
        this.volumeSlider.value = this.audio.volume * 100;
        break;
      case "ArrowDown":
        event.preventDefault();
        this.setVolume(Math.max(0, this.audio.volume * 100 - 5));
        this.volumeSlider.value = this.audio.volume * 100;
        break;
    }
  }

  createPlaylist() {
    this.playlistItems.innerHTML = "";

    this.songs.forEach((song, index) => {
      const playlistItem = document.createElement("div");
      playlistItem.className = "playlist-item";
      playlistItem.innerHTML = `
                <div class="playlist-item-art">
                    <img src="${song.albumArt}" alt="${song.title}">
                </div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
                <div class="playlist-item-duration">${song.duration}</div>
            `;

      playlistItem.addEventListener("click", () => {
        this.currentSongIndex = index;
        this.loadCurrentSong();
        if (this.isPlaying) {
          setTimeout(() => this.play(), 500);
        }
      });

      this.playlistItems.appendChild(playlistItem);
    });

    this.updatePlaylistActive();
  }

  updatePlaylistActive() {
    const playlistItems = this.playlistItems.querySelectorAll(".playlist-item");
    playlistItems.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentSongIndex);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayer();
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".music-player, .playlist");
  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease-out";
    observer.observe(el);
  });
});
