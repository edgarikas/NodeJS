// Variables
const navElement = document.querySelector('nav');

// Functions
const generateNavigation = () => {
  // -- creating navigation elements
  // --- <ul>
  const ul = document.createElement('ul');

  // --- <li> X 3
  const li1 = document.createElement('li'); // Home
  const li2 = document.createElement('li'); // Signup/Login
  const li3 = document.createElement('li'); // My account

  const a1 = document.createElement('a'); // Home
  const a2 = document.createElement('a'); // Signup/Login
  const a3 = document.createElement('a'); // My account

  a1.href = location.href.includes('pages') ? '../index.html' : './index.html';
  a2.href = location.href.includes('pages')
    ? './signup-login.html'
    : './pages/signup-login.html';
  a3.href = location.href.includes('pages')
    ? './my-account.html'
    : './pages/my-account.html';

  a1.innerText = 'Home';
  a2.innerText = 'Signup/Login';
  a3.innerText = 'My account';

  li1.appendChild(a1);
  li2.appendChild(a2);
  li3.appendChild(a3);

  if (localStorage.getItem('user')) {
    ul.append(li1, li3);
  } else {
    ul.append(li1, li2);
  }

  navElement.appendChild(ul);
};

// Events
document.addEventListener('DOMContentLoaded', generateNavigation);
