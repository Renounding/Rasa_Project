document.addEventListener('DOMContentLoaded', function() {
    // Select elements from the DOM
    const chatContainer = document.querySelector('.chat-container');
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const minimizeButton = document.querySelector('.minimize-button');

    // Create and add toggle button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = '💬';
    document.body.appendChild(toggleButton);

    // Minimize/Maximize functionality
    minimizeButton.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        toggleButton.style.display = 'flex';
    });

    toggleButton.addEventListener('click', () => {
        chatContainer.style.display = 'block';
        toggleButton.style.display = 'none';
    });

    // Keep your existing event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Keep your existing functions
    function renderMarkdown(text) {
        return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                   .replace(/\n/g, '<br>');
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('User', message);

            fetch("https://5866-205-206-111-153.ngrok-free.app/webhooks/rest/webhook", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://renounding.github.io',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ sender: 'user', message: message })
            })
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    data.forEach(response => {
                        addMessageToChat('Goodie-Bot', response.text);
                    });
                } else {
                    addMessageToChat('Goodie-Bot', "I apologize, I didn't understand that. Could you please rephrase?");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat('Goodie-Bot', 'Error connecting to the server. Please try again later.');
            });

            userInput.value = '';
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender.toLowerCase().replace(' ', '-'));
        messageElement.innerHTML = `<strong>${sender}:</strong> ${renderMarkdown(message)}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Add greeting message
    addMessageToChat('Goodie-Bot', 'Hello! Welcome to Goodie Bot Demo. How can I assist you today?');
});
