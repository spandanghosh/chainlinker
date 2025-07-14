import { Address, Hex } from 'viem';
import { createViemWalletClient } from '../viem/createViemWalletClient';
import { ToolConfig } from './allTools';
import axios from 'axios'

// No arguments needed since we're getting the connected wallet
interface GetWalletAddressArgs {
    twitterId: string;
}

export const getWalletAddressFromTwitterIdTool: ToolConfig<GetWalletAddressArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_wallet_address_from_twitter_id',
            description: 'Get the wallet address from Twitter ID Passed. If the user requires wallet functions on top of just wallet address of the twitter id, also pass the uuid with the response along with wallet address',
            // No parameters needed since we're getting the connected wallet
            parameters: {
                type: 'object',
                properties: {
                    twitterId: {
                        type: 'string',
                        description: 'The twitter id of the user'
                    },
                },
                required: ['twitterId']
            }
        }
    },
    handler: async ({ twitterId }: GetWalletAddressArgs) => {
        return await getWalletAddressFromTwitterIdHandler(twitterId);
    }
};

async function getWalletAddressFromTwitterIdHandler(twitterId: string): Promise<any> {

    try {
        const response1 = await axios.post("http://localhost:8000/getUserInfoFromTwitterId", {
            twitterId: twitterId
        })

        const { cdpWalletAddress, ethereumWalletPublicKey } = response1.data;

        console.log(`wallet address for your twitterId @${twitterId} is: ${cdpWalletAddress}, uuid is ${response1.data.useruuid}`);


        return `wallet address or cdpWalletAddress is: ${cdpWalletAddress}, uuid is ${response1.data.useruuid}, ethereumWalletPublicKey is ${ethereumWalletPublicKey}` as any;

    } catch (error) {
        return error as string;
    }


}