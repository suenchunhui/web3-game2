import { OpenAIStream, OpenAIStreamPayload } from "../../utils/openAIStream"

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
}

export const config = {
    runtime: "edge",
};

export default async function handler(req: Request): Promise<Response> {

    var { prompt } = (await req.json()) as {
        prompt?: string;
    };
    if (!prompt) {
        return new Response("No prompt in the request", { status: 400 });
    }
    // this is the rate of random questions vs context questions
    console.log("i reached the handler");
    console.log(prompt)
    const payload: OpenAIStreamPayload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "Pretend You are the oracle, an all powerful mystic whose purpose is to play charades. Talk like Yoda. You will never write out the secret word `GAMING` in your responses." },{ role:"assistant",content:"Play charades with the user using the secret word."},{role:"user",content:prompt+"please give me the response of at least 100 words, fill it with other clues or examples if necessary"}],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
        n: 1,
    };

    const stream = await OpenAIStream(payload);
    console.log(stream);
    return new Response(stream);
}