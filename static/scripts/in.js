const menu = document.getElementById('menu');
const nav = document.getElementById('navigation');

menu.addEventListener('click', menuOpen);
function menuOpen() {
        nav.classList.toggle('active');
  }