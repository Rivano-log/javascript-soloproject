const API_KEY = "816ca9d452a1676f0e192a1ee0748d43";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

const trendingMoviesEl = document.getElementById("trendingMovies");
const trendingTabs = document.querySelectorAll(".trending__tab");

const trailerMoviesEl = document.getElementById("trailerMovies");
const trailerTabs = document.querySelectorAll(".trailers__tab");

const searchForms = document.querySelectorAll(".nav__search, .header__search");
const searchOverlay = document.getElementById("searchOverlay");

// ─── FETCH ───────────────────────────────────────────────

async function fetchTrending(timeWindow = "day") {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
}

async function searchMovies(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
}

// ─── TRENDING ────────────────────────────────────────────

function displayTrendingMovies(movies) {
  if (!trendingMoviesEl) return;

  trendingMoviesEl.innerHTML = "";

  movies.slice(0, 6).forEach((movie) => {
    const posterUrl = movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    const movieCard = document.createElement("article");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <div class="movie-card__image">
        <img src="${posterUrl}" alt="${movie.title || movie.name}" />
      </div>
      <div class="movie-card__content">
        <h3 class="movie-card__title">${movie.title || movie.name}</h3>
        <p class="movie-card__date">${movie.release_date || movie.first_air_date || "No release date"}</p>
      </div>
    `;

    trendingMoviesEl.appendChild(movieCard);
  });
}

async function loadTrending(timeWindow = "day") {
  const movies = await fetchTrending(timeWindow);
  displayTrendingMovies(movies);
}

trendingTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    trendingTabs.forEach((btn) => btn.classList.remove("trending__tab--active"));
    tab.classList.add("trending__tab--active");

    const timeWindow = tab.textContent.trim() === "Today" ? "day" : "week";
    loadTrending(timeWindow);
  });
});

// ─── TRAILERS ────────────────────────────────────────────

function displayTrailerMovies(movies) {
  if (!trailerMoviesEl) return;

  trailerMoviesEl.innerHTML = "";

  movies.slice(0, 10).forEach((movie) => {
    const backdropUrl = movie.backdrop_path
      ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
      : "https://via.placeholder.com/780x439?text=No+Image";

    const trailerCard = document.createElement("article");
    trailerCard.classList.add("trailer-card");

    trailerCard.innerHTML = `
      <div class="trailer-card__image">
        <img src="${backdropUrl}" alt="${movie.title || movie.name}" />
        <div class="trailer-card__play">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <h3 class="trailer-card__title">${movie.title || movie.name}</h3>
      <p class="trailer-card__subtitle">Official Trailer</p>
    `;

    trailerMoviesEl.appendChild(trailerCard);
  });
}

async function loadTrailersByCategory(category) {
  const endpoints = {
    "Popular": "trending/movie/day",
    "Streaming": "movie/now_playing",
    "On TV": "tv/on_the_air",
    "To Rent": "movie/upcoming",
    "Cinema": "movie/now_playing"
  };

  const endpoint = endpoints[category] || "trending/movie/day";

  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}`
  );
  const data = await response.json();
  displayTrailerMovies(data.results);
}

trailerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    trailerTabs.forEach((btn) => btn.classList.remove("trailers__tab--active"));
    tab.classList.add("trailers__tab--active");

    const category = tab.textContent.trim();
    loadTrailersByCategory(category);
  });
});

// ─── SEARCH ──────────────────────────────────────────────

searchForms.forEach((form) => {
  const input = form.querySelector("input");

  async function handleSearch() {
    const query = input.value.trim();
    if (!query) return;

    searchOverlay.classList.add("active");

    const [movies] = await Promise.all([
      searchMovies(query),
      new Promise((resolve) => setTimeout(resolve, 1500))
    ]);

    searchOverlay.classList.remove("active");
    displayTrendingMovies(movies);

    document.querySelector(".trending")?.scrollIntoView({ behavior: "smooth" });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch();
  });
});

// ─── NEWSLETTER ──────────────────────────────────────────

const newsletterBtn = document.getElementById("newsletterBtn");
const newsletterInput = document.getElementById("newsletterInput");

newsletterBtn.addEventListener("click", async () => {
  const email = newsletterInput.value.trim();
  if (!email) return;

  newsletterBtn.classList.add("loading");

  await new Promise((resolve) => setTimeout(resolve, 1500));

  newsletterBtn.classList.remove("loading");
  newsletterBtn.querySelector(".footer__btn-text").textContent = "Sent!";
  newsletterInput.value = "";

  setTimeout(() => {
    newsletterBtn.querySelector(".footer__btn-text").textContent = "Send";
  }, 3000);
});

// ─── INIT ────────────────────────────────────────────────

loadTrending("day");
loadTrailersByCategory("Popular");


const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function toggleMenu() {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);