import bot from '/assets/bot.svg';
import user from '/assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('.chatContainer');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi ? 'ai' : 'user'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // Remove the card container from the page
    const cardContainer = document.querySelector('.card-container');
    if (cardContainer) {
         cardContainer.style.display = 'none'; // Hide the card container
    }

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    // to clear the textarea input 
    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    const response = await fetch('https://infogpt-1.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    clearInterval(loadInterval)
    messageDiv.innerHTML = " ";

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})

// Function to focus on the search input and pre-fill it
document.addEventListener("DOMContentLoaded", () => {
    const cardElements = document.querySelectorAll(".card");
  
    cardElements.forEach((card) => {
      card.addEventListener("click", () => {
        const value = card.querySelector(".card-title").innerText;
        const input = document.getElementById("searchInput");
        input.value = value; // Pre-fill input box
        input.focus(); // Focus the input box
      });
    });
  });
  
  
