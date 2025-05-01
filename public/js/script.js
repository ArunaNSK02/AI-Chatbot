
// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

recognition.lang = 'en-US';
recognition.interimResults = false;

// Start recognition when the button is clicked
document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    console.log('User:', text);
    socket.emit('message', text);
});

socket.on('response', (response) => {
    console.log('Response:', response);
});