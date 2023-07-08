const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Export flexible function to be called with prompt templates and specified model
export async function generateCompletion(prompt: string, model: string) {
  const completion = await openai.createChatCompletion({
    model: model,
    messages: [{"role": "user", "content": prompt}],
  });
  return completion.data.choices[0].message.content;
}