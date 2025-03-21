const API_URL = 'https://chat.nrywhite.lat/chats';

document.addEventListener('DOMContentLoaded', function() {
    createDOMElements();
    addEventListeners();
    setInterval(fetchData, 10000); // Refresh data every 10 seconds
    fetchData(); 
});

function createDOMElements() {
    // Create the elements to the DOM

    //chat messages
    const counterDivMessages = document.createElement('div');
    counterDivMessages.className = 'messages_column';

    const messageContainer = document.createElement('div');
    messageContainer.className = 'chat_container';

    const textHolder = document.createElement('p');
    textHolder.className = 'text_holder';
    textHolder.textContent = 'No messages yet';

    messageContainer.appendChild(textHolder);
    counterDivMessages.appendChild(messageContainer);
    document.body.appendChild(counterDivMessages);

    //message input
    const textarea = document.createElement('textarea');
    textarea.name = 'text';
    textarea.id = 'enter-input';
    textarea.maxLength = 140;

    const button = document.createElement('button');
    button.id = 'btn';
    button.textContent = 'Submit';

    const paragraph = document.createElement('p');
    paragraph.id = 'gfg';

    const counterDiv = document.createElement('div');
    counterDiv.className = 'counter';

    const counterCharacters = document.createElement('p');
    counterCharacters.className = 'counter_characters';
    counterCharacters.textContent = '0';

    const maxCharacters = document.createElement('p');
    maxCharacters.textContent = '140';

    counterDiv.appendChild(counterCharacters);
    counterDiv.appendChild(maxCharacters);

    document.body.appendChild(textarea);
    document.body.appendChild(button);
    document.body.appendChild(paragraph);
    document.body.appendChild(counterDiv);
}

function addEventListeners() {
    // Add event listeners as before
    const inputElement = document.getElementById('enter-input');
    if (inputElement) {
        inputElement.oninput = function() {
            let textarea = document.getElementById('enter-input');
            let counter_characters = document.querySelector('.counter_characters');

            textarea.oninput = function() {
                counter_characters.innerText = textarea.value.length;
            };
        };

        inputElement.addEventListener("keypress", function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const textarea = document.getElementById('enter-input');
                const message = textarea.value;
                if (message) {
                    postData({ username: 'YourUsername', message: message });
                    textarea.value = ''; // Clear the textarea after sending the message
                }
            }
        });
    }

    document.getElementById("btn").addEventListener("click", function () {
        const textarea = document.getElementById('enter-input');
        const message = textarea.value;
        if (message) {
            postData({ username: 'Javier B', message: message });
            textarea.value = ''; // Clear the textarea after sending the message
        }
    });
}

// Function to detect URLs in a string
function detectURL(message) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.match(urlRegex);
}

// Function to create a preview element for a URL
function createURLPreview(url) {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'url_preview';

    const link = document.createElement('a');
    link.href = url;
    link.textContent = url;
    link.target = '_blank';

    previewContainer.appendChild(link);
    return previewContainer;
}

// Modify fetchData function to include URL detection and preview rendering
async function fetchData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('No se pudo fechear');
        }

        const data = await response.json();
        console.log(data);

        const messageContainer = document.querySelector('.chat_container');
        messageContainer.innerHTML = ''; // Clear previous messages

        data.forEach((Object) => {
            const { username, message } = Object;

            const messageElement = document.createElement('p');
            messageElement.className = 'message';
            messageElement.textContent = `${username}: ${message}`;

            messageContainer.appendChild(messageElement);

            // Detect URLs and create previews
            const urls = detectURL(message);
            if (urls) {
                urls.forEach(url => {
                    const previewElement = createURLPreview(url);
                    messageContainer.appendChild(previewElement);
                });
            }
        });
    } catch (error) {
        console.error('Hubo un herror fecheando', error);
    }
}

// Function to POST the data to the API
async function postData(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('No se pudo postear');
        }

        fetchData(); // Fetch the data again to update the messages
    } catch (error) {
        console.error('Hubo un herror posteando', error);
    }
}