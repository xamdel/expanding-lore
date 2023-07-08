const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Export flexible function to be called with prompt templates and specified model
export async function generateCompletion(userPrompt: string, model: string, systemPrompt?: string) {
  const messages = [
    {
      "role": "user",
      "content": userPrompt
    }
  ];

  if (systemPrompt) {
    messages.unshift({
      "role": "system",
      "content": systemPrompt
    });
  }

  const completion = await openai.createChatCompletion({
    model: model,
    messages: messages,
  });

  return completion.data.choices[0].message.content;
}