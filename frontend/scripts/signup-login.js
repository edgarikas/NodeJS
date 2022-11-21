import { API_URL } from './modules/constants.js';

// Variables
const loginFormElement = document.querySelector('#login-form');
const signupFormElement = document.querySelector('#signup-form');

// Funtions
const loginUser = async (e) => {
  e.preventDefault();

  const user = {
    email: e.target.login_email.value,
    password: e.target.login_password.value,
  };

  if (!user.email || !user.password) {
    alert('Please provide needed information');
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + '/users/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    ).json();

    if (data.message === 'User founded') {
      localStorage.setItem('user', data.user._id);
      location.href = 'http://127.0.0.1:5500/frontend/pages/my-account.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const signupUser = async (e) => {
  e.preventDefault();

  const user = {
    name_surname: e.target.signup_name_surname.value,
    email: e.target.signup_email.value,
    password: e.target.signup_password.value,
  };

  if (!user.name_surname || !user.email || !user.password) {
    alert('Please provide needed information');
    return;
  }

  try {
    const data = await (
      await fetch(API_URL + '/users/signup', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(user),
      })
    ).json();

    if (data.message === 'User created') {
      localStorage.setItem('user', data.user._id);
      location.href = 'http://127.0.0.1:5500/frontend/pages/my-account.html';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
};

// Events
loginFormElement.addEventListener('submit', loginUser);
signupFormElement.addEventListener('submit', signupUser);
