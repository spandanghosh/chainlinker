

import { readContractTool } from './readContract';
import { sendTransactionCdpTool } from './sendTransactionCdp';
import { writeContractTool } from './writeContract';
import { getContractAbiTool } from './getContractAbi';
import { getTransactionReceiptTool } from './getTransactionReceipt';
import { deployErc20Tool } from './deployErc20';
import { uniswapV3CreatePoolTool } from './uniswapV3createPool';
import { approveTokenAllowanceTool } from './approveTokenAllowance';
import { sayHiTool } from './sayHiTool';
import { getInfoAboutCoin } from './getInfoAboutCoin';

import { createDonationTemplateTool } from './createDonationTemplate';
import { getWalletAddressFromTwitterIdTool } from './getWalletAddressFromTwitterId';
import { getBalanceCdpAddressTool } from './getBalanceCdpAddress';
import {trackCoinPriceCronJob} from './createCronJob';
import { sendTransactionCustomChainTool } from './sendTransactionCustomChain';
import { getBalanceCustomTool } from './getBalanceCustom';

export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
                required: string[];
            };
        };
    };
    handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {

    // == CREATE == \\
    create_donation_template: createDonationTemplateTool,

    get_info_about_coin: getInfoAboutCoin,

    get_wallet_address_from_twitter_id: getWalletAddressFromTwitterIdTool,

    get_balance_cdp_address: getBalanceCdpAddressTool,


    send_transaction_cdp: sendTransactionCdpTool,

    track_coin_price_cron_job: trackCoinPriceCronJob,
    send_transaction_custom_chain: sendTransactionCustomChainTool,

    get_balance_custom: getBalanceCustomTool,



    // == READ == \\
    get_contract_abi: getContractAbiTool,
    read_contract: readContractTool,
    get_transaction_receipt: getTransactionReceiptTool,
    // get_contract_bytecode: getContractBytecodeTool,

    // == WRITE == \\
    write_contract: writeContractTool,
    deploy_erc20: deployErc20Tool,
    create_uniswap_v3_pool: uniswapV3CreatePoolTool,
    approve_token_allowance: approveTokenAllowanceTool,

    say_hi: sayHiTool
    // Add more tools here...
};
