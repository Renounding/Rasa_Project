document.addEventListener('DOMContentLoaded', function () {
    // Select elements from the DOM
    const chatContainer = document.querySelector('.chat-container');
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const minimizeButton = document.querySelector('.minimize-button');

    console.log('Elements initialized:', { chatContainer, chatWindow, userInput, sendButton });

    // Create and add toggle button
    const toggleButton = document.createElement('div');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = '💬';
    document.body.appendChild(toggleButton);

    minimizeButton.addEventListener('click', (event) => {
        event.preventDefault();
        chatContainer.style.display = 'none';
        toggleButton.style.display = 'flex';
    });

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        chatContainer.style.display = 'block';
        toggleButton.style.display = 'none';
    });

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('User', message);

            fetch("https://ca33-205-206-111-153.ngrok-free.app", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ sender: 'user', message }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.length > 0) {
                        data.forEach((response) => {
                            if (response.buttons) {
                                response.buttons.forEach((button) => {
                                    addDynamicButton(button.title, button.url);
                                });
                            }
                            if (response.text) {
                                addMessageToChat('Goodie-Bot', renderMarkdown(response.text));
                            }
                        });
                    } else {
                        addMessageToChat('Goodie-Bot', "I didn't understand that. Can you rephrase?");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    addMessageToChat('Goodie-Bot', 'Connection issue. Try again later.');
                });

            userInput.value = '';
        }
    }

    function renderMarkdown(text) {
        return text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                   .replace(/\n/g, '<br>');
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender.toLowerCase().replace(' ', '-'));
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function addDynamicButton(text, url) {
        const button = document.createElement('a');
        button.className = 'dynamic-button';
        button.innerText = text;
        button.href = url;
        button.target = '_blank';
        chatWindow.appendChild(button);
    }

    // Greeting and topics functionality
    function addGreetingWithTopics() {
        console.log('Adding greeting and topics...');
        addMessageToChat('Goodie-Bot', 'Welcome to our fake website. My name is Goodie, and I am your Academic Assistant! Please select a topic below:');

        // Create a container for the topic buttons
        const topicsContainer = document.createElement('div');
        topicsContainer.classList.add('topics-container');

        // Define topics and create buttons
        const topics = ['Programs', 'Admissions', 'Fees'];
        topics.forEach((topic) => {
            const button = document.createElement('button');
            button.className = 'topic-button';
            button.innerText = topic;
            button.addEventListener('click', () => handleTopicSelection(topic));
            topicsContainer.appendChild(button);
        });

        // Append the topics container to the chat window
        chatWindow.appendChild(topicsContainer);
    }

    function handleTopicSelection(topic) {
        console.log(`Topic selected: ${topic}`);
        addMessageToChat('User', topic);

        fetch("https://ca33-205-206-111-153.ngrok-free.app/webhooks/rest/webhook", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ sender: 'user', message: topic }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.length > 0) {
                    data.forEach((response) => {
                        if (response.buttons) {
                            response.buttons.forEach((button) => {
                                addDynamicButton(button.title, button.url);
                            });
                        }
                        if (response.text) {
                            addMessageToChat('Goodie-Bot', renderMarkdown(response.text));
                        }
                    });
                } else {
                    addMessageToChat('Goodie-Bot', "I didn't understand that. Can you rephrase?");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                addMessageToChat('Goodie-Bot', 'Connection issue. Try again later.');
            });
    }

    // Initialize the chatbot with the greeting and topics
    addGreetingWithTopics();
});
