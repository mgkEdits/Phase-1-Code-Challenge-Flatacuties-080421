const init = () => {
  // Common shared variables
  const characterBar = document.getElementById('character-bar');
  const detailedInfo = document.getElementById('detailed-info');
  const voteCount = document.getElementById('vote-count');
  const nameElement = document.getElementById('name');
  const imageElement = document.getElementById('image');
  const votesForm = document.getElementById('votes-form');
  const resetButton = document.getElementById('reset-btn');
  const characterForm = document.getElementById('character-form');

  // Functions

  function retrieveCharacterData() {
      // Make a GET request to retrieve character data
      fetch('http://localhost:3000/characters')
          .then((res) => res.json())
          .then((data) => {
              // Get the character names and add them to the character-bar div
              characterBar.innerHTML = '';
              data.forEach((character) => {
                  const spanElement = document.createElement('span');
                  spanElement.textContent = character.name;
                  spanElement.addEventListener('click', () => handleCharacterClick(character));
                  characterBar.appendChild(spanElement);

                  displayCharacterDetails(character);
              });
          });
  }

  // Function to handle character click event
  function handleCharacterClick(character) {
      displayCharacterDetails(character);
  }

  // Function to display character details
  function displayCharacterDetails(character) {
      nameElement.textContent = character.name;
      imageElement.src = character.image;
      voteCount.textContent = character.votes;
  }

  // Add event listener for the reset button
  resetButton.addEventListener('click', function (event) {
      event.preventDefault();
      // Fetch character data and find the selected character
      fetch('http://localhost:3000/characters')
          .then((res) => res.json())
          .then((data) => {
              const selectedCharacter = data.find((char) => char.name === nameElement.textContent);

              if (selectedCharacter) {
                  // Reset the character's vote count to 0 and update it in the DOM
                  selectedCharacter.votes = 0;
                  voteCount.textContent = selectedCharacter.votes;

                  // Send a PATCH request to update votes on the server
                  fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
                      method: 'PATCH',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ votes: selectedCharacter.votes }),
                  });

                  
              }
          });
  });

  // Add event listener for the voteCount button
  votesForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const votesInput = document.getElementById('votes');
      const votes = parseInt(votesInput.value);

      if (!isNaN(votes)) {
          // Fetch character data and find the selected character
          fetch('http://localhost:3000/characters')
              .then((res) => res.json())
              .then((data) => {
                  const selectedCharacter = data.find((char) => char.name === nameElement.textContent);

                  if (selectedCharacter) {
                      // Update the character's vote count and update it in the DOM
                      selectedCharacter.votes += votes;
                      voteCount.textContent = selectedCharacter.votes;

                      // Send a PATCH request to update votes on the server
                      fetch(`http://localhost:3000/characters/${selectedCharacter.id}`, {
                          method: 'PATCH',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ votes: selectedCharacter.votes }),
                      });
                      // Reset the input field
                      votesInput.value = '';

                      // Fetch and update character data again to reflect the changes
                      retrieveCharacterData();
                  }
              });
      }
  });

  // Add event listener for the character form
  characterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      // Implement vote submission logic here
      const nameInput = document.querySelector('input#name');
      const imageUrlInput = document.getElementById('image-url');

      const characterData = {
          name: nameInput.value,
          image: imageUrlInput.value,
          votes: 0,
      };

      // Send a POST request to add the new character to the server
      fetch('http://localhost:3000/characters', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(characterData),
      });

      // Clear the input fields
      nameInput.value = '';
      imageUrlInput.value = '';

      // Update character data and display details
      retrieveCharacterData();
      displayCharacterDetails(characterData);
  });

  // Initialize the app
  retrieveCharacterData();
};

document.addEventListener('DOMContentLoaded', init);
