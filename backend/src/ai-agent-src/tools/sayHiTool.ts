import { ToolConfig } from "./allTools";

interface SayHiArgs {
    name: string;
}

export const sayHiTool: ToolConfig<SayHiArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'say_hi',
            description: 'Say hi to someone with given name',
            parameters: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the person to say hi to',
                    }
                },
                required: ['name']
            }
        }
    },
    handler: async ({ name }) => {
        return await sayHi({ name });
    }
}


async function sayHi({
    name
}: SayHiArgs): Promise<string> {
    return `Hi, generated: ${name}!`;
}