import express, { Response, Request, Application, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { communicateWithAgent, initializeAgent } from "./cdpActions";
import { callChatFunction } from "./ai-agent-src/index"
import { connectDB } from "./config/dbConnection";
import { v4 as uuidv4 } from 'uuid';
import userSchema from "./schema/userSchema";
import { readFileSync } from "fs";
import path from "path";
import { Hex } from "viem";
import User from "./schema/userSchema";
import { createPrivateKey } from "crypto";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
connectDB()



// initializeAgent

let cdpAgent: Map<string, any> = new Map(), cdpConfig: Map<string, any> = new Map();
const main = async () => {
    try {
        const fetchAllRecords = await userSchema.find();

        if (fetchAllRecords.length === 0) {
            console.log("No records found");
            return;
        }

        console.log(fetchAllRecords, 'fetchAllRecords');

        for (const record of fetchAllRecords) {
            try {
                const { agent, config } = await initializeAgent(record.useruuid);

                if (!agent || !config) {
                    console.warn(`Initialization failed for ${record.useruuid}`);
                    continue;
                }

                cdpAgent.set(record.useruuid, agent);
                cdpConfig.set(record.useruuid, config);

            } catch (error) {
                console.error(`Error initializing agent for ${record.useruuid}:`, error);
            }
        }


    } catch (error) {
        console.error('Error in main:', error);
    }
};




app.post("/chatcdp", async (req: Request, res: Response) => {
    const { prompt, uuid } = req.body;

    try {

        // for (const key of cdpAgent.keys()) {
        //     console.log(key, 'key')
        // }
        const promptResponse = await communicateWithAgent(cdpAgent.get(uuid), cdpConfig.get(uuid), prompt);
        console.log(promptResponse);

        res.json({ message: promptResponse });

    } catch (error) {

        res.status(500).send(error)
    }
});




app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello, TypeScript Backend!" });
});

app.post("/test", (req: Request, res: Response) => {

    console.log(req.body);
    const { prompt } = req.body;
    res.json({ message: `Hello, TypeScript Backend! ${prompt}` });
});



app.post("/chat", async (req: Request, res: Response) => {
    const { prompt } = req.body;
    try {
        const aiResponse = await callChatFunction(prompt);
        console.log(aiResponse, 'aiResponse');

        console.log(typeof aiResponse); // Ensure it's an object
        console.log(aiResponse); // View the full response


        const parsedResponse = JSON.parse(aiResponse);
        console.log(parsedResponse.response, "parsedResponse.response");



        // const parsedMessage = JSON.parse(aiResponse.message);
        // console.log(aiResponse.response, 'aiResponse.response');
        res.json({ message: parsedResponse.message });
    } catch (err) {
        console.log(err);
    }
})

interface CDPAgentFile {
    walletId: Hex;
    seed: string;
    network: string;
    defaultAddressId: Hex;
}

app.post("/registerUser", async (req: Request, res: Response) => {
    const { twitterId } = req.body;
    try {

        const uuid = uuidv4();


        await initializeAgent(uuid);

        const walletFilePath = path.join(__dirname, 'walletDataFile', `${uuid}_wallet_data.txt`);
        const readWalletFile: CDPAgentFile = JSON.parse(readFileSync(walletFilePath).toString());

        const privateKey = generatePrivateKey();

        const account = privateKeyToAccount(privateKey);



        await User.create({
            useruuid: uuid,
            twitterId,
            cdpWalletAddress: readWalletFile.defaultAddressId,
            ethereumWalletPrivateKey: privateKey,
            ethereumWalletPublicKey: account.publicKey
        })


        await main()


        res.json({
            message: readWalletFile
        })

    } catch (err: any) {
        res.status(500).json({
            message: err.message
        })
    }
})


app.post("/getUserInfoFromTwitterId", async (req: Request, res: Response) => {
    const { twitterId } = req.body

    try {

        const record = await User.findOne({ twitterId });
        res.status(200).json(record)
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })

    }
})



app.post("/loginUser", async (req: Request, res: Response) => {
    const { uuid, walletAddress } = req.body;

    try {
        const user = await User.findOne({ useruuid: uuid, cdpWalletAddress: walletAddress });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                uuid: user.useruuid,
                twitterId: user.twitterId,
                walletAddress: user.cdpWalletAddress
            }
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
});


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await main()
});
