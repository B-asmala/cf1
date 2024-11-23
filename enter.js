//to handle when user hits enter
const input = document.getElementById('handles-input');

input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    showRace(input.value)
  }
});