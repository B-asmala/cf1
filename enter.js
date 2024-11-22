// Get the input element by its ID
const input = document.getElementById('handles-input');

// Add an event listener to listen for the 'keydown' event
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    showRace(input.value)
  }
});