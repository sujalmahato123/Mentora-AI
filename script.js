const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const learningLevel = document.getElementById("learningLevel");
const language = document.getElementById("language");
const sendButton = document.getElementById("sendButton");


// Suggested question use
function useSuggestion(text) {
    messageInput.value = text;
    messageInput.focus();
}


// Add message to chat screen
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender);

    const contentDiv = document.createElement("div");

    contentDiv.classList.add("message-content");

    contentDiv.innerText = text;

    messageDiv.appendChild(contentDiv);

    chatArea.appendChild(messageDiv);

    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}


// Send message to AI
async function sendMessage() {

    const message = messageInput.value.trim();

    // Don't send empty message
    if (!message) return;


    // Show user message
    addMessage(message, "user");


    // Clear input
    messageInput.value = "";


    // Disable send button
    sendButton.disabled = true;


    // Create loading message
    const loadingDiv = document.createElement("div");

    loadingDiv.classList.add("message", "ai");


    const loadingContent = document.createElement("div");

    loadingContent.classList.add("message-content");

    loadingContent.innerText = "Mentora AI is thinking... 🤖";


    loadingDiv.appendChild(loadingContent);

    chatArea.appendChild(loadingDiv);

    chatArea.scrollTop = chatArea.scrollHeight;


    try {

        // Send request to Node.js backend
        const response = await fetch("http://localhost:8000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                learning_level: learningLevel.value,

                language: language.value,

                explanation_style: "Simple"

            })

        });


        // Check if backend returned an error
        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.details ||
                errorData.error ||
                "Server error occurred"
            );

        }


        // Convert backend response to JSON
        const data = await response.json();


        // Remove loading message
        loadingDiv.remove();


        // Show AI response
        addMessage(data.response, "ai");


    } catch (error) {

        console.error("Mentora AI Error:", error);


        // Remove loading message
        loadingDiv.remove();


        // Show actual error
        addMessage(
            "⚠️ Error: " + error.message,
            "ai"
        );

    }


    // Enable button again
    sendButton.disabled = false;


    // Focus input
    messageInput.focus();

}


// Send message when Enter key is pressed
messageInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();

    }

});


// Focus input when page loads
messageInput.focus();