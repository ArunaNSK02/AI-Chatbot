const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const OpenAI = require('openai');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 5000;

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Web Speech API",
    },
});

async function main(text) {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          "role": "user",
          "content": text
        }
      ],
      
    });
    return(completion.choices[0].message.content);
}


app.use(express.static(__dirname + '/public')); // js, css, images

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/views/index.html');
});

httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', async (text) => {
        const response = await main(text);
        socket.emit('response', response);
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


