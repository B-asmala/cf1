

// Get the navbar
const navbar = document.getElementById('navbar');

// Listen for scroll events
window.addEventListener('scroll', () => {
  if (window.scrollY > 0) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
