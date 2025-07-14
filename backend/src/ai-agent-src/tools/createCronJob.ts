import axios from 'axios';
// import cron from 'node-cron';
import cron from 'node-cron';
import { ToolConfig } from './allTools';

interface CronJobArgs {
    twitterId: string;
    coinName: string;
    interval: string; // Cron expression (e.g., "*/1 * * * *" for every minute)
    wantedPrice: number; // Target price to determine direction
}

export const trackCoinPriceCronJob: ToolConfig<CronJobArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'track_coin_price_cron_job',
            description: 'Tracks the price of a cryptocurrency at a scheduled interval and determines the price direction',
            parameters: {
                type: 'object',
                properties: {
                    twitterId: {
                        type: 'string',
                        description: 'The Twitter ID of the user to send the price alerts to.',
                    },
                    coinName: {
                        type: 'string',
                        description: 'The name of the coin to track (e.g., BTC, ETH).',
                    },
                    interval: {
                        type: 'string',
                        description: 'Cron schedule for running the job (e.g., "*/1 * * * *" for every minute).',
                    },
                    wantedPrice: {
                        type: 'number',
                        description: 'The target price to compare with the current price to determine direction.',
                    }
                },
                required: ['twitterId','coinName',  'wantedPrice']
            }
        }
    },
    handler: async ({ twitterId, coinName,  wantedPrice }) => {
        schedulePriceCheck(twitterId, coinName,  wantedPrice);
        return `Scheduled price tracking for ${coinName}  and target price: ${wantedPrice} USD`;
    }
};

async function getCurrentPrice(symbol: string) {
    const url = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest";
    const headers = {
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY, // Replace with your API key
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers, params: { symbol, convert: 'USD' } });
        return response.data.data[symbol][0].quote["USD"].price;
    } catch (error) {
        console.error(`Error fetching price: ${error}`);
        return null;
    }
}

const activeCronJobs:any = {}; // Store running jobs in memory


async function schedulePriceCheck(twitterId:string, coinName: string, wantedPrice: number) {


    const priceTemp = await getCurrentPrice(coinName);
    if (priceTemp === null) {
        console.error(`Error fetching price for ${coinName}. Exiting...`);
        return;
    }

    const directionGlobal = wantedPrice > priceTemp ? "⬆️ UP" : "⬇️ DOWN";


    activeCronJobs[twitterId] = cron.schedule("*/10 * * * * *", async () => {
        const price = await getCurrentPrice(coinName);
        if (price !== null) {
            const direction = wantedPrice > price ? "⬆️ UP" : "⬇️ DOWN";

            if(direction !== directionGlobal) {
                console.log(`⏳ [${new Date().toISOString()}] ${coinName} price: $${price.toFixed(2)} | Target: $${wantedPrice} | Direction: ${direction}`);
                stopCronJob(twitterId);
            }
        }
    });
}


// twitterId is twitterId here
function stopCronJob(twitterId: string) {
    if (!activeCronJobs[twitterId]) {
        console.log(`⚠️ No active cron job found for ${twitterId}`);
        return;
    }

    console.log(`🛑 Stopping cron job for ${twitterId}`);

    activeCronJobs[twitterId].stop();
    delete activeCronJobs[twitterId];
}