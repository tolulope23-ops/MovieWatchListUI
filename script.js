const apiUrl = 'http://localhost:3000/api/v3/movie'; // replace with actual API endpoint

// DOM elements
const movieList = document.getElementById('movieList');
const movieModal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close');
const movieForm = document.getElementById('movieForm');
const addMovieBtn = document.getElementById('addMovieBtn');
let currentMovie = null;

// Functions
async function fetchMovies() {
  try {
    const response = await fetch(apiUrl);
    const movies = await response.json();
    renderMovies(movies.data);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function renderMovies(movies) {
  movieList.innerHTML = '';
  movies.forEach(movie => {    
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <h3>${movie.title}</h3>
      <p>Genre: ${movie.genre}</p>
      <p>Released: ${movie.released.split('T')[0]}</p>
      <p>Watched: ${movie.watched ? 'Yes' : 'No'}</p>
      <div class="actions">
        <button onclick="editMovie('${movie._id}')">Edit</button>
        <button onclick="deleteMovie('${movie._id}')">Delete</button>
      </div>
    `;
    movieList.appendChild(movieCard);
  });
}

function openModal() {
  movieModal.style.display = 'flex';
}

function closeModalFunc() {
  movieModal.style.display = 'none';
}

async function addOrUpdateMovie(event) {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;
  const released = document.getElementById('released').value;
  const watched = document.getElementById('watched').checked;
  const movieData = { title, genre, released, watched };

  // Add / Update logic
  if(currentMovie){
    await fetch(`${apiUrl}/${currentMovie}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
  }
  else{
    await fetch(`${apiUrl}/add`, {
      method: 'POST', // Change to PUT for updates
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
  }
  closeModalFunc();
  fetchMovies();
}

async function deleteMovie(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchMovies();
}

async function editMovie(id) {
  currentMovie = id;
    openModal();
  // Fetch and populate modal with movie data for editing
}

// Event Listeners
addMovieBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
movieForm.addEventListener('submit', addOrUpdateMovie);

// Initial Fetch
fetchMovies();