import BaseOpenAI from "openai";
import { promptlayer } from "promptlayer";

const OpenAI: typeof BaseOpenAI = promptlayer.OpenAI;
const openai = new OpenAI();

export async function GET(request: Request) {
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
    // @ts-ignore
    pl_tags: ["test"],
  });

  const text = response.choices[0].message.content;
  return new Response(text, { status: 200 });
}
