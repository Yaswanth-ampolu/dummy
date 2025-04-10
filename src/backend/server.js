const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', (req, res) => {
    // Dummy implementation for demonstration
    const { userInput } = req.body;
    const aiResponse = `Backend says: You said "${userInput}"`;
    res.json({ response: aiResponse });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
