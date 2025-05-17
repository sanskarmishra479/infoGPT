import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    res.status(200).send({
      bot: result.response.text(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});


app.listen(5000, () => console.log('AI server started on http://localhost:5000'));

