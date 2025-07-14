import { Address, parseEther, AccessList, createWalletClient, http, Chain, createPublicClient } from 'viem'
import { createViemWalletClient } from '../viem/createViemWalletClient.js';
import { ToolConfig } from './allTools.js';
import { flowTestnet } from 'viem/chains';

interface SendTransactionArgs {
    to: Address;
    value?: string;
    sender: Address;
}

export const sendTransactionCustomChainTool: ToolConfig<SendTransactionArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'send_transaction_custom_chain',
            description: "Send a transaction in the specified chain mentioned, don't run if its base sepolia or no chain is mentioned",
            parameters: {
                type: 'object',
                properties: {
                    to: {
                        type: 'string',
                        description: 'The recipient address',
                    },
                    from: {
                        type: 'string',
                        description: 'The sender address',
                    },
                    value: {
                        type: 'string',
                        description: 'The amount of ETH to send (in ETH, not Wei)',
                    },

                    chain: {
                        type: 'string',
                        description: 'The chain name mentioned in the query, it can be flow, and not base sepolia',
                    }
                },
                required: ['to', 'value', 'chain'],
            }
        }
    },
    handler: async ({
        to,
        value,
        sender
    }) => {
        return await sendTransaction({
            to,
            value,
            sender,
        });
    }
};

async function sendTransaction({
    to,
    value,
    sender,
}: SendTransactionArgs) {
    try {
        const client = createWalletClient({
            chain: flowTestnet,
            transport: http(),
        });

        const publicClient = createPublicClient({
            chain: flowTestnet,
            transport: http(),
        });

        console.log(`Sending ${value} ETH to ${to}`);

        const tx = await client.sendTransaction({
            account: sender,
            to,
            value: BigInt(value!), // Convert ETH to Wei
        });

        await publicClient.waitForTransactionReceipt({
            hash: tx,
        });

        return `Transaction sent: https://evm.flowscan.io/${tx}`
    } catch (error: any) {
        return {
            success: false,
            hash: null,
            message: "Error: " + error.message
        };
    }
}
