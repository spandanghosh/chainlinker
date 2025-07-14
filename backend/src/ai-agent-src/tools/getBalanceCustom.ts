import { Address, createPublicClient, http } from 'viem';
import { createViemPublicClient } from '../viem/createViemPublicClient';
import { ToolConfig } from './allTools';
import { formatEther } from 'viem';
import { flowTestnet } from 'viem/chains';

interface GetBalanceArgs {
    wallet: Address;
    chain: string;
}

export const getBalanceCustomTool: ToolConfig<GetBalanceArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_balance_custom',
            description: 'Get the balance of a wallet in the specified chain mentioned, if its base sepolia or no chain is mentioned dont run this tool',
            parameters: {
                type: 'object',
                properties: {
                    wallet: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The wallet address to get the balance of',
                    },

                    chain: {
                        type: 'string',
                        description: 'The chain name mentioned in the query, it can be flow, and not base sepolia',
                    }
                },
                required: ['wallet', 'chain']
            }
        }
    },
    handler: async ({ wallet, chain }) => {
        return await getBalance(wallet, chain);
    }
};

async function getBalance(wallet: Address, chain: string) {
    if (chain.toLowerCase() == 'flow') {
        const publicClient = createPublicClient({
            chain: flowTestnet,
            transport: http(),
        });
        const balance = await publicClient.getBalance({ address: wallet });
        return formatEther(balance);
    } else {
        return 'Please mention the chain as flow to get the balance';
    }
}