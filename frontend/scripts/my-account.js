import { API_URL } from './modules/constants.js';

// Variables
const addMovieFormElement = document.querySelector('#add-movie-form');
const userLogoutButtonElement = document.querySelector('#user-logout-button');

// Funtions
const addMovie = async (e) => {
  e.preventDefault();

  const movie = {
    userId: localStorage.getItem('user'),
    movie_name: e.target.movie_name.value,
    movie_category: e.target.movie_category.value,
    movie_rent_price: e.target.movie_rent_price.value,
    is_available: true,
  };

  if (!movie.movie_name || !movie.movie_category || !movie.movie_rent_price) {
    alert('Please provide needed information');
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + '/movies', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(movie),
      })
    ).json();

    if (data.message === 'Movie added') {
      addMovieFormElement.reset();
      getUserData();
    } else {
      alert('Movie not added please try again later');
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserData = async () => {
  const userId = localStorage.getItem('user');

  try {
    const data = await (await fetch(API_URL + '/users/' + userId)).json();

    const currentUserElement = document.querySelector('#current-user');

    currentUserElement.innerText = 'Hello, ' + data.name_surname;

    showUserMovies(data.movies);
    showUserOrders(data.orders);
  } catch (error) {
    console.log(error);
  }
};

const showUserMovies = async (moviesArray) => {
  const tbodyForUserMovies = document.querySelector('#tbody-for-user-movies');

  while (tbodyForUserMovies.firstElementChild) {
    tbodyForUserMovies.removeChild(tbodyForUserMovies.firstElementChild);
  }

  moviesArray.forEach((movie) => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td'); // Movie name
    const td2 = document.createElement('td'); // Movie category
    const td3 = document.createElement('td'); // Movie rent price
    const td4 = document.createElement('td'); // Movie availability

    td1.innerText = movie.movie_name;
    td2.innerText = movie.movie_category;
    td3.innerText = movie.movie_rent_price;
    td4.innerText = movie.is_available ? 'Available' : 'Not available';

    tr.append(td1, td2, td3, td4);

    tbodyForUserMovies.appendChild(tr);
  });
};

const showUserOrders = async (ordersArray) => {
  console.log(ordersArray);
  const tbodyForUserOrders = document.querySelector('#tbody-for-user-orders');

  while (tbodyForUserOrders.firstElementChild) {
    tbodyForUserOrders.removeChild(tbodyForUserOrders.firstElementChild);
  }

  ordersArray.forEach((order) => {
    const tr = document.createElement('tr');

    const td1 = document.createElement('td'); // Movie name
    const td2 = document.createElement('td'); // Movie category
    const td3 = document.createElement('td'); // Movie rent price
    const td4 = document.createElement('td'); // Movie returning term

    td1.innerText = order.movie_name;
    td2.innerText = order.movie_category;
    td3.innerText = order.movie_rent_price;
    td4.innerText = `After ${order.return_days} days`;

    tr.append(td1, td2, td3, td4);

    tbodyForUserOrders.appendChild(tr);
  });
};

const logoutUser = () => {
  localStorage.removeItem('user');
  location.href = 'http://127.0.0.1:5500/frontend/index.html';
};

// Events
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('user')) {
    getUserData();
  } else {
    location.href = 'http://127.0.0.1:5500/frontend/index.html';
  }
});

addMovieFormElement.addEventListener('submit', addMovie);
userLogoutButtonElement.addEventListener('click', logoutUser);
