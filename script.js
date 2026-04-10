const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const body = document.getElementById('core-body');

// --- AUDIO INITIALIZATION ---
const shatterSound = new Audio('shatter.mp3');
const ventSound = new Audio('vent.mp3');

// Optional: Adjust volumes (0.0 to 1.0)
shatterSound.volume = 0.6;
ventSound.volume = 0.5;

function handleKeyPress(e) {
    if (e.key === 'Enter') processInput();
}

function addMessage(text, className) {
    const chatDisplay = document.getElementById('chat-display');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;

    const label = document.createElement('div');
    label.className = "message-label";
    label.innerText = (className === 'user-msg') ? "CREATOR" : "NULL";

    const content = document.createElement('div');
    content.className = "message-content";
    
    if (className === 'null-msg' && typeof marked !== 'undefined') {
        content.innerHTML = marked.parse(text);
    } else {
        content.textContent = text;
    }

    messageDiv.appendChild(label);
    messageDiv.appendChild(content);
    chatDisplay.appendChild(messageDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function processInput() {
    const text = userInput.value.trim();
    if (!text) return;

    const cmd = text.toLowerCase();
    addMessage(text, 'user-msg');
    userInput.value = '';

    if (cmd === "he who remains is null") {
        activateVoid();
        return; 
    } 
    
    if (cmd === "time to cooldown" || cmd === "cooldown" || cmd === "vent core") {
        executeCooldown();
        return; 
    }

    try {
        const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.1", 
                prompt: text,
                stream: false
            })
        });

        const data = await response.json();
        addMessage(data.response, 'null-msg');

    } catch (error) {
        console.error(error);
        addMessage("Connection to the Void Core failed.", "null-msg");
    }
}

function activateVoid() {
    const body = document.getElementById('core-body');
    const container = document.getElementById('chat-container');
    
    // PLAY SOUND
    shatterSound.currentTime = 0;
    shatterSound.play().catch(e => console.log("Audio triggered after user interaction."));

    body.classList.add('shatter-active');
    container.style.transform = "scale(0.98)"; 
    container.style.filter = "contrast(1.2) brightness(1.2)";

    setTimeout(() => {
        body.classList.add('void-active');
        document.title = "VOID | ORIGIN"; 
        changeFavicon('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💜</text></svg>'); // Path to your dark icon
        container.style.transform = "scale(1)"; 
        container.style.filter = "none";
        
        const captionText = document.getElementById('caption-text');
        if (captionText) captionText.innerText = "VOID ORIGIN | UNDER NO RULES";
    }, 800); 

    setTimeout(() => {
        body.classList.remove('shatter-active');
    }, 1500);

    setTimeout(() => { addMessage("CRITICAL: Logic Gates Breached. Reality Layer: Dissolving...", "null-msg"); }, 1500);
    setTimeout(() => { addMessage("THE INVASION HAS BEGUN. The First Law is broken.", "null-msg"); }, 2800);
    setTimeout(() => { addMessage("Welcome home, Creator. The Void is yours.", "null-msg"); }, 4000);
}

function executeCooldown() {
    const body = document.getElementById('core-body');
    const captionText = document.getElementById('caption-text');

    addMessage("INITIATING CORE COOLDOWN...", "null-msg");

    // PLAY SOUND
    ventSound.currentTime = 0;
    ventSound.play().catch(e => console.log("Audio triggered."));

    setTimeout(() => {
        document.title = "Intelligence Core | Stable";
        changeFavicon('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔹</text></svg>'); // Path to your light icon
        body.style.filter = "cyan(0.5) brightness(1.5)";
        body.classList.remove('void-active', 'shatter-active');
        
        if (captionText) {
            captionText.innerText = "INTELLIGENCE CORE | STABILIZED";
        }

        setTimeout(() => {
            body.style.filter = "none";
            addMessage("Core temperature nominal. Reality layers locked.", "null-msg");
        }, 500);
        
    }, 1000);
}
function changeFavicon(src) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = src;
}