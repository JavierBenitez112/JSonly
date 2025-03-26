const API_URL = 'https://chat.nrywhite.lat/chats';

document.addEventListener('DOMContentLoaded', function() {
    createDOMElements();
    addEventListeners();
    setInterval(fetchData, 10000); // Refresh data every 10 seconds
    fetchData(); 
});

function createDOMElements() {
    // Create main chat application container
    const chatApp = document.createElement('div');
    chatApp.className = 'chat-application';

    // Create responsive container
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    // Messages column wrapper
    const messagesColumn = document.createElement('div');
    messagesColumn.className = 'messages-column';

    // Message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'chat_container';

    // Input section wrapper
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';

    // Character counter wrapper
    const counterWrapper = document.createElement('div');
    counterWrapper.className = 'counter-wrapper';

    // Textarea for messaging
    const textarea = document.createElement('textarea');
    textarea.name = 'text';
    textarea.classList.add('text_field');
    textarea.placeholder = 'Enter a message';
    textarea.maxLength = 140;

// Send button
const sendButton = document.createElement('button');
sendButton.id = 'btn';
sendButton.className = 'send';
sendButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
`;

// Theme toggle button (keeping the existing code)
const themeToggleButton = document.createElement('button');
themeToggleButton.className = 'theme-toggle';
themeToggleButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657L5.93 5.93m12.14 12.14 1.414 1.414M6.343 6.343 5.93 5.93m12.14 12.14 1.414 1.414"/>
        <circle cx="12" cy="12" r="5"/>
    </svg>
`;

    // Character counter
    const counterCharacters = document.createElement('span');
    counterCharacters.className = 'counter_characters';
    counterCharacters.textContent = '0';

    const maxCharacters = document.createElement('span');
    maxCharacters.className = 'max_characters';
    maxCharacters.textContent = ' / 140';

    // Assemble the structure
    messagesColumn.appendChild(messageContainer);
    
    // Create a flex container for input and theme toggle
    const inputFlexContainer = document.createElement('div');
    inputFlexContainer.className = 'input-flex-container';
    
    inputFlexContainer.appendChild(themeToggleButton);
    inputFlexContainer.appendChild(textarea);
    inputFlexContainer.appendChild(sendButton);

    inputWrapper.appendChild(inputFlexContainer);

    counterWrapper.appendChild(counterCharacters);
    counterWrapper.appendChild(maxCharacters);

    chatContainer.appendChild(messagesColumn);
    chatContainer.appendChild(inputWrapper);
    chatContainer.appendChild(counterWrapper);

    chatApp.appendChild(chatContainer);

    // Add to body
    document.body.appendChild(chatApp);

    // Add event listener for theme toggle
    themeToggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });

    // Optional: Add responsive meta tag if not already present
    const responsiveMeta = document.createElement('meta');
    responsiveMeta.name = 'viewport';
    responsiveMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(responsiveMeta);
}



function addEventListeners() {
    const textarea = document.querySelector('.text_field');
    const counterCharacters = document.querySelector('.counter_characters');
    const button = document.getElementById('btn');

    if (textarea && counterCharacters) {
        textarea.addEventListener('input', function() {
            counterCharacters.innerText = textarea.value.length;
        });

        textarea.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default action (new line)
                const message = textarea.value;
                if (message) {
                    postData({ username: 'Javier B', message: message });
                    textarea.value = ''; // Clear the textarea after sending the message
                    counterCharacters.innerText = '0'; // Reset the counter
                }
            }
        });
    }

    if (button) {
        button.addEventListener('click', function() {
            const message = textarea.value;
            if (message) {
                postData({ username: 'Javier B', message: message });
                textarea.value = ''; // Clear the textarea after sending the message
                counterCharacters.innerText = '0'; // Reset the counter
            }
        });
    }
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

        // Fetch the data again to update the messages
        fetchData();

        // Add animation to the new message
        const messageContainer = document.querySelector('.chat_container');
        const newMessage = document.createElement('p');
        newMessage.className = 'message';
        newMessage.textContent = `${data.username}: ${data.message}`;
        messageContainer.appendChild(newMessage);

        // Detect URLs and create previews
        const urls = detectURL(data.message);
        if (urls) {
            urls.forEach(url => {
                const previewElement = createURLPreview(url);
                messageContainer.appendChild(previewElement);
            });
        }

        // Scroll to the bottom of the chat container
        messageContainer.scrollTop = messageContainer.scrollHeight;

    } catch (error) {
        console.error('Hubo un herror posteando', error);
    }
}

// Function to add theme toggle button and functionality
function addThemeToggle() {
    const themeToggleButton = document.createElement('button');
    themeToggleButton.textContent = 'Toggle Dark Theme';
    themeToggleButton.className = 'theme-toggle';
    document.body.appendChild(themeToggleButton);

    themeToggleButton.addEventListener('click', function() {
        document.body.classList.toggle('--dark-theme');
    });
}