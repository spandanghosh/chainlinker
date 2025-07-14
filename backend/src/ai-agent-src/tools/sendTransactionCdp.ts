import { Address } from 'viem';
import { ToolConfig } from './allTools';
import axios from 'axios';

interface SendTransactionArgs {
    from: Address;
    to: Address;
    value: string;
    uuid: string;
}

export const sendTransactionCdpTool: ToolConfig<SendTransactionArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'send_transaction_cdp',
            description: 'Send transactions from a specific sender to a recipient using extracted wallet addresses. Amount is given in ETH.',
            parameters: {
                type: 'object',
                properties: {
                    from: {
                        type: 'string',
                        description: 'The sender’s wallet address extracted from the get_wallet_address_from_twitter_id tool.',
                    },
                    to: {
                        type: 'string',
                        description: 'The recipient wallet address extracted from the get_wallet_address_from_twitter_id tool.',
                    },
                    value: {
                        type: 'string',
                        description: 'The amount of ETH to send (in ETH, not Wei).',
                    },
                    uuid: {
                        type: 'string',
                        description: 'The UUID of the sender retrieved from the get_wallet_address_from_twitter_id tool.',
                    }
                },
                required: ['from', 'to', 'value', 'uuid']
            }
        }
    },
    handler: async ({ from, to, value, uuid }) => {
        return await sendTransaction({ from, to, value, uuid });
    }
};

async function sendTransaction({ from, to, value, uuid }: SendTransactionArgs) {
    try {
        console.log(`Sending ${value} ETH from ${from} to ${to}, UUID: ${uuid}`);

        const { data } = await axios.post("http://localhost:8000/chatcdp", {
            prompt: `Send transaction from ${from} to ${to}, amount is ${value}`,
            uuid: uuid,
        });

        return `${data.message}`;
    } catch (error) {
        console.error("Transaction Error:", error);
        return `Error processing transaction: ${error}`;
    }
}
