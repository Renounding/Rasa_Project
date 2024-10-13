// Select elements from the DOM
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Event listeners for sending message with button click or pressing Enter key
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

// Function to send the message to the Rasa bot
function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessageToChat('User', message);

        // Send message to Rasa server via the ngrok URL
        // Replace 'your-ngrok-url' with your actual ngrok URL
        fetch("https://768f-205-206-111-153.ngrok-free.app/webhooks/rest/webhook", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: 'user', message: message }),
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach(response => {
                    addMessageToChat('Bot', response.text);
                });
            } else {
                addMessageToChat('Bot', 'Sorry, I didn\'t understand that. Can you rephrase?');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            addMessageToChat('Bot', 'Error connecting to the server. Please try again later.');
        });

        userInput.value = ''; // Clear the input field
    }
}

// Function to add messages to the chat window
function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender.toLowerCase());
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
}

// Optional: Add a greeting message when the chat loads
window.addEventListener('load', () => {
    addMessageToChat('Bot', 'Hello! Welcome to Alberta Education Consultants. How can I assist you today?');
});