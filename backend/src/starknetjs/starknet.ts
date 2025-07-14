import { Account, RpcProvider, constants, Contract, json } from 'starknet';
import fs from 'fs'
import path from 'path';

async function main() {

    // connect to network
    // const provider = new RpcProvider({ nodeUrl: constants.NetworkName.SN_SEPOLIA });


    // // connect to account
    // const privateKey = process.env.STARKNET_PRIVATE_KEY!;
    // const accountAddress = '0x64b48806902a367c8598f4f95c305e8c1a1acba5f082d294a43793113115691';

    // const account = new Account(provider, accountAddress, privateKey);

    // // contract
    // const contractAddr = ""
    // const compressedContract = await provider.getClassAt(contractAddr);
    // @ts-ignore
    const outputPath = path.join(__dirname, '../starknetcontract/target/dev/starknetcontract_MyToken.contract_class.json');
    // fs.writeFileSync(outputPath, json.stringify(compressedContract.abi, undefined, 2));
    const a = fs.readFileSync(outputPath)
    console.log(a, "outputPath")


}

main()