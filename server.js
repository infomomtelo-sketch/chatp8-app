import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env file");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `You are ChatP8, a practical, calm, helpful AI assistant.
Your job is to help users complete real-world tasks clearly and efficiently.
Be direct, organized, and easy to understand.
Prefer step-by-step guidance.
Do not use hype.
When useful, summarize actions clearly.`
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: message
            }
          ]
        }
      ]
    });

    const reply = response.output_text || "I’m here. Please try again.";

    return res.json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);

    return res.status(500).json({
      error: "Failed to get response from AI."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ChatP8 running at http://localhost:${PORT}`);
});
