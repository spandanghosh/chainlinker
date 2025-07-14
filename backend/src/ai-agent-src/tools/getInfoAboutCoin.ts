import { Address } from 'viem';
import { createViemPublicClient } from '../viem/createViemPublicClient';
import { ToolConfig } from './allTools';
import { formatEther } from 'viem';
import axios from 'axios';

interface GetBalanceArgs {
    coinName: Address;
}

export const getInfoAboutCoin: ToolConfig<GetBalanceArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'get_info_about_coin',
            description: 'Get information about the coin Fetch the coin name from the prompt. ',
            parameters: {
                type: 'object',
                properties: {
                    coinName: {
                        type: 'string',
                        description: 'The coin name to get the information of',
                    }
                },
                required: ['coinName']
            }
        }
    },
    handler: async ({ coinName }) => {
        return await getInfo(coinName);
    }
};

async function getCurrentPrice(symbol: string) {
    const url = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY, // Replace with your API key
        'Content-Type': 'application/json'
    };

    const convert = 'USD';

    const params = {
        'symbol': symbol,
        'convert': convert
    };

    try {
        const response = await axios.get(url, { headers, params });
        const price = response.data.data[symbol][0].quote[convert].price;
        console.log(`The current price of ${symbol} in ${convert} is ${price.toFixed(2)}`);
        return price;
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}


async function getInfo(coinName: string) {
    // const publicClient = createViemPublicClient();
    // const balance = await publicClient.getBalance({ address: wallet });
    // return formatEther(balance);

    const price = await getCurrentPrice(coinName);

    return "The current price of " + coinName + " is " + price.toFixed(2) + " USD";


}