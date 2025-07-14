import { Address } from 'viem';
import { createViemPublicClient } from '../viem/createViemPublicClient';
import { ToolConfig } from './allTools';
import { formatEther } from 'viem';
import axios from 'axios';

interface GetBalanceArgs {
    wallet: string;
    uuid: string;
}

export const getBalanceCdpAddressTool: ToolConfig<GetBalanceArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_balance_cdp_address',
            description: "Run only when chain is not mentioned or base sepolia is mentioned. Get the balance of a wallet address and uuid passed from get wallet address from twitter id tool, don't run this tool if the chain is flow",
            parameters: {
                type: 'object',
                properties: {
                    wallet: {
                        type: 'string',
                        description: 'The wallet address of the user which is retrieved from the get_wallet_address_from_twitter_id tool',
                    },
                    uuid: {
                        type: 'string',
                        description: 'The uuid of the user which is retrieved from the get_wallet_address_from_twitter_id tool',
                    }
                },
                required: ['wallet', 'uuid']
            }
        }
    },
    handler: async ({ wallet, uuid }) => {
        return await getBalance(wallet, uuid);
    }
};

async function getBalance(wallet: string, uuid: string) {
    const { data } = await axios.post("http://localhost:8000/chatcdp", {
        prompt: `Get balance of ${wallet}`,
        uuid: uuid
    })

    const { message } = data;
    return message;
}