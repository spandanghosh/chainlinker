import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant';
import { createThread } from './openai/createThread';
import { createRun } from './openai/createRun';
import { performRun } from './openai/performRun';
import { Thread } from 'openai/resources/beta/threads/threads';
import { Assistant } from 'openai/resources/beta/assistants';
import { config } from "dotenv"


config()

const client = new OpenAI();



async function chat(prompt: string, thread: Thread, assistant: Assistant) {

    const userInput = prompt;


    try {
        // Add the user's message to the thread
        await client.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userInput
        });

        // Create and perform the run
        const run = await createRun(client, thread, assistant.id);
        const result = await performRun(run, client, thread);

        // if (result?.type === 'text') {
        //     console.log('\nAlt:', result.text.value);
        // }

        // @ts-ignore
        console.log('\nAI:', result?.text.value);

        // @ts-ignore
        return result?.text.value;

    } catch (error) {
        console.error('Error during chat:', error instanceof Error ? error.message : 'Unknown error');
    }
}

export async function callChatFunction(prompt: string) {
    try {
        const assistant = await createAssistant(client);
        const thread = await createThread(client);

        console.log('Chat started! Type "exit" to end the conversation.');
        // console.log(await chat(prompt, thread, assistant));
        return await chat(prompt, thread, assistant)

    } catch (error) {
        console.error('Error in main:', error instanceof Error ? error.message : 'Unknown error');
    }
}

// main().catch((error) => {
//     console.error('Unhandled error:', error instanceof Error ? error.message : 'Unknown error');
//     process.exit(1);
// });
