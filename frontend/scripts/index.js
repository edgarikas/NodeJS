import { API_URL } from './modules/constants.js';

// Variables
const moviesContainerElement = document.querySelector('#movies-container');

// Funtions
const getData = async () => {
  try {
    const data = await (await fetch(API_URL + '/movies')).json();

    showMovies(data);
  } catch (error) {
    console.log(error);
  }
};

const showMovies = async (moviesArray) => {
  while (moviesContainerElement.firstElementChild) {
    moviesContainerElement.removeChild(
      moviesContainerElement.firstElementChild
    );
  }

  const loggedInUserId = localStorage.getItem('user');

  const movies = loggedInUserId
    ? moviesArray.filter((movie) => movie.userId !== loggedInUserId)
    : moviesArray;

  movies.forEach((movie) => {
    const ul = document.createElement('ul');

    const li1 = document.createElement('li');
    const li2 = document.createElement('li');
    const li3 = document.createElement('li');
    const li4 = document.createElement('li');
    const button = document.createElement('button');

    li1.innerText = movie.movie_name;
    li2.innerText = movie.movie_category;
    li3.innerText = movie.movie_rent_price;
    button.innerText = 'Rent';
    button.setAttribute('data-owner-id', movie.userId);
    button.setAttribute('data-movie-name', movie.movie_name);
    button.setAttribute('data-movie-category', movie.movie_category);
    button.setAttribute('data-movie-rent-price', movie.movie_rent_price);

    li4.appendChild(button);

    ul.append(li1, li2, li3);

    if (loggedInUserId) {
      ul.appendChild(li4);
    }

    button.addEventListener('click', rentMovie);
    moviesContainerElement.appendChild(ul);
  });
};

const rentMovie = async (e) => {
  const loggedInUserId = localStorage.getItem('user');

  const update = {
    movieOwnerId: e.target.dataset.ownerId,
    movie_name: e.target.dataset.movieName,
    movie_category: e.target.dataset.movieCategory,
    movie_rent_price: e.target.dataset.movieRentPrice,
  };

  try {
    const data = await (
      await fetch(API_URL + '/movies/' + loggedInUserId, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(update),
      })
    ).json();

    if (data.message === 'Movie rented') {
      getData();
    } else {
      alert('Failed to rent movie');
    }
  } catch (error) {
    console.log(error);
  }
};

// Events
document.addEventListener('DOMContentLoaded', getData);
