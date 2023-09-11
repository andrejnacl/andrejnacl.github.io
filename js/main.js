let gameFinished;
let hangmanAnswer;
let guessedLetters;
let guessedWrongLetters;
let numberOfGuesses;
let allowedGuesses;
let englishWords = [];

function guessLetter() {

    let letter = document.getElementById("letter-input").value;
    letter = letter.toLowerCase();
    // Check if the user entered a name and it's not null or empty
    if (letter && letter.trim() !== "") {
        // Check if the user entered more than one letter or a number
        if (letter.length !== 1 || !isNaN(letter)) {
            alert("Please enter a single letter!");
            return;
        }
        
        // Check if the user entered the same letter before
        if (guessedLetters.indexOf(letter) > -1 || guessedWrongLetters.indexOf(letter) > -1) {
            alert("You have already guessed this letter!");
        } 
        else {
            
            if (hangmanAnswer.indexOf(letter) > -1) {
            alert("You found a new letter!");
            guessedLetters.push(letter);
            displayGuessedLetters()

            hiddenAnswer = ""

            for(const char of hangmanAnswer) {
                if(guessedLetters.indexOf(char) > -1) {
                    hiddenAnswer = hiddenAnswer + char
                } else {
                    hiddenAnswer = hiddenAnswer + " _ "   
                }
            }

            displayHiddenAnswer()

            if(hiddenAnswer === hangmanAnswer) {
                gameFinished = true
                alert(`You won the game! The answer was ${hiddenAnswer}!`)
            }

        } else {
            alert(`Your letter ${letter} is not in the word!`);
            guessedWrongLetters.push(letter)
            displayGuessedWrongLetters()
        }

        numberOfGuesses++
        displayNumberOfGuesses()

        if(numberOfGuesses === allowedGuesses && !gameFinished){
            gameFinished = true
            alert(`You are dead. Sad story. The answer was ${hangmanAnswer}.`)
        }
    }

        clearLetterInput() 
        if(gameFinished) {
            const guessButton = document.getElementById("guess-button");
            guessButton.disabled = true
            alert(`Game over, please reset the game.`)
        }

    }
}

// Function to get a random word
function getRandomWord() {

    const randomIndex = Math.floor(Math.random() * englishWords.length);
    return englishWords[randomIndex];
}

document.addEventListener("DOMContentLoaded", function () {
    resetGame();
});

document.addEventListener("keyup", function(event) {    
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("guess-button").click();
    }
});

async function resetGame() {
    gameFinished = false;

    await fetchAndProcessData();

    hangmanAnswer = getRandomWord();
    const answerDisplay = document.getElementById("answer-display");
    //answerDisplay.textContent = hangmanAnswer
    console.log(hangmanAnswer)

    allowedGuesses = 2 * hangmanAnswer.length;

    hiddenAnswer = hangmanAnswer.replace(/./g, "_ ");
    displayHiddenAnswer()

    guessedLetters = [];
    displayGuessedLetters()

    guessedWrongLetters = [];
    displayGuessedWrongLetters()

    numberOfGuesses = 0;
    displayNumberOfGuesses()

    clearLetterInput()

    const guessButton = document.getElementById("guess-button");
    guessButton.disabled = false
}

function displayGuessedLetters() {
    const guessedLettersSentence = `You have guessed so far these letter: ${guessedLetters.sort().join(", ")}`
    const guessedLettersDisplay = document.getElementById("guessedLetters-display");
    guessedLettersDisplay.textContent = guessedLettersSentence
}

function displayHiddenAnswer() {
    const hiddenAnswerDisplay = document.getElementById("hiddenAnswer-display");
    hiddenAnswerDisplay.textContent = hiddenAnswer
}

function clearLetterInput() {
    const letterInput =  document.getElementById("letter-input");
    letterInput.value = ""
    letterInput.focus()
}

function displayGuessedWrongLetters() {
    const guessedWrongLettersSentence = `These letters are not in the word: ${guessedWrongLetters.sort().join(", ")}`
    const guessedWrongLettersDisplay = document.getElementById("guessedWrongLetters-display");
    guessedWrongLettersDisplay.textContent = guessedWrongLettersSentence
}

function displayNumberOfGuesses() {
    const numberOfGuessesSentence = `You have ${allowedGuesses - numberOfGuesses} guesses available until you die.`
    const numberOfGuessesDisplay = document.getElementById("numberOfGuesses-display");
    numberOfGuessesDisplay.textContent = numberOfGuessesSentence
}

function fetchAlternative() {
    // Make the fetch request
    let miau = fetch('https://raw.githubusercontent.com/dariusk/corpora/master/data/words/nouns.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process and return the array of nouns
            englishWords = data.nouns;
            englishWords = englishWords.filter(word => word.length > 5);
            return englishWords;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    return miau;        
}

async function fetchAndProcessData() {
    try {
        const data = await fetchAlternative();
        // You can work with 'data' here once the Promise is resolved
        console.log('Data fetched.');

        // Continue with other actions or processing here
    } catch (error) {
        console.error('Error:', error);
    }
}
