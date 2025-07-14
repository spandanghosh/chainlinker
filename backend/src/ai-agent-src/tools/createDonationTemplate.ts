import { Address } from 'viem';
import { createViemPublicClient } from '../viem/createViemPublicClient';
import { ToolConfig } from './allTools';
import { formatEther } from 'viem';
import { PinataSDK } from "pinata-web3";

interface createDonationTemplateArgs {
    // wallet: Address;
    currentAccount: Address;
    chain: string;
    templateName: string;
    receiverAddress: Address;
    imageUrl: string;
    bgColor: string;
    buttonColor: string;
    heading: string;
    text: string;
    btnText: string;

}

// const data = {
//     templateId: currentAccount + "_" + templateName,
//     chain,
//     templateType: "donation",
//     receiverAddress,
//     imageUrl,
//     bgColor,
//     buttonColor,
//     heading,
//     text,
//     btnText,
//   };



export const createDonationTemplateTool: ToolConfig<createDonationTemplateArgs> = {
    definition: {
        type: 'function',
        function: {
            name: 'create_donation_template',
            description: `Create a donation template. 
            Set Image as 'https://plus.unsplash.com/premium_photo-1683140538884-07fb31428ca6?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' if no image url is available.
            If parameters are not provided, default values will be used. Choose it according to what feels appropriate according to prompt.
            Set receiver account as current account if not provided explicitly. Current Account is the account that is currently connected to the dapp.
            Set chain as 'BaseSepolia' if not provided explicitly. Another option for chain is 'Starknet'.
            `,
            // ",
            parameters: {
                type: 'object',
                properties: {
                    // wallet: {
                    //     type: 'string',
                    //     pattern: '^0x[a-fA-F0-9]{40}$',
                    //     description: 'The wallet address to get the balance of',
                    // }
                    currentAccount: {
                        type: 'string',
                        description: 'The current address',
                    },
                    chain: {
                        type: 'string',
                        description: 'The chain',
                    },
                    templateName: {
                        type: 'string',
                        description: 'The template name',
                    },
                    receiverAddress: {
                        type: 'string',
                        description: 'The receiver address',
                    },
                    imageUrl: {
                        type: 'string',
                        description: 'The image url',
                    },
                    bgColor: {
                        type: 'string',
                        description: 'The background color',
                    },
                    buttonColor: {
                        type: 'string',
                        description: 'The button color',
                    },
                    heading: {
                        type: 'string',
                        description: 'The heading',
                    },
                    text: {
                        type: 'string',
                        description: 'The text',
                    },
                    btnText: {
                        type: 'string',
                        description: 'The button text',
                    }

                },
                required: ['currentAccount', 'templateName', 'receiverAddress']
            }
        }
    },
    handler: async ({ 
        currentAccount,
        chain,
        templateName,
        receiverAddress,
        imageUrl,
        bgColor,
        buttonColor,
        heading,
        text,
        btnText
     }) => {
        return await createDonationTemplate(
            currentAccount,
            chain,
            templateName,
            receiverAddress,
            imageUrl,
            bgColor,
            buttonColor,
            heading,
            text,
            btnText
        );
    }
};

async function createDonationTemplate(
    currentAccount: Address,
    chain: string,
    templateName: string,
    receiverAddress: Address,
    imageUrl: string,
    bgColor: string,
    buttonColor: string,
    heading: string,
    text: string,
    btnText: string
) {
    const data = {
        templateId: currentAccount + "_" + templateName,
        chain,
        templateType: "donation",
        receiverAddress,
        imageUrl,
        bgColor,
        buttonColor,
        heading,
        text,
        btnText,
      };
  
      console.log(data, " data");

  
      const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT, // Access the variable using import.meta.env
        pinataGateway: "coral-light-cicada-276.mypinata.cloud",
      });
  
      const upload = await pinata.upload.json(data);
  
      console.log(upload, " upload");
  
      const cid = upload?.IpfsHash;
      console.log("IPFS json CID:", cid);
      console.log(
        "IPFS json URL:",
        `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`
      );
      
    // return `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`;

    return `<emb ${cid} emb>`;

    //   return 
      // if (cid) {
      //   setImageUrl(
      //     `https://coral-light-cicada-276.mypinata.cloud/ipfs/${cid}`
      //   );
      // }
  
      // contract operations
    //   if (embedlyContract) {
    //     const tx = await embedlyContract?.addTemplate(cid);
    //     console.log(tx, " tx");
    //     await tx?.wait();
  
    //     // setTemplateSnippet(`<emb ${cid} emb>`);
        // activate modal
  
    //   }
}

