import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
// import * as readline from "readline";

dotenv.config();



// Configure a file to persist the agent's CDP MPC Wallet Data

async function initializeAgent(uuid: string) {
  const WALLET_DATA_FILE = path.join(__dirname, 'walletDataFile', `${uuid}_wallet_data.txt`);
  console.log(WALLET_DATA_FILE, 'wallet data file')
  // Initialize LLM
  console.log("Initialized LLM", process.env.XAI_API_KEY);


  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: process.env.XAI_API_KEY,
  });


  let walletDataStr: string | null = null;

  // Read existing wallet data if available
  if (fs.existsSync(WALLET_DATA_FILE)) {
    try {
      walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      // Continue without wallet data
    }
  }

  // Configure CDP AgentKit
  const config = {
    cdpWalletData: walletDataStr || undefined,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  // Initialize CDP AgentKit
  const agentkit = await CdpAgentkit.configureWithWallet(config);

  // Initialize CDP AgentKit Toolkit and get tools
  const cdpToolkit = new CdpToolkit(agentkit);
  const tools = cdpToolkit.getTools();

  // Store buffered conversation history in memory
  const memory = new MemorySaver();
  const agentConfig = {
    configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
  };

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier:
      "You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit...",
  });

  // Save wallet data
  const exportedWallet = await agentkit.exportWallet();
  fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

  return { agent, config: agentConfig };
}



const communicateWithAgent = async (agent: any, config: any, prompt: string) => {
  console.log("Starting Agent...", prompt);


  let fullResponse = ""; // Initialize an empty string to store the full response.

  const stream = await agent.stream(
    { messages: [new HumanMessage(prompt)] },
    config,
  );


  for await (const chunk of stream) {
    if ("agent" in chunk) {
      fullResponse += chunk.agent.messages[0].content + "\n";
    } else if ("tools" in chunk) {
      fullResponse += chunk.tools.messages[0].content + "\n";
    }
    // You can log if needed during the chunk processing.
    console.log("-------------------");
  }


  return fullResponse; // Return the accumulated full response.
};


export { communicateWithAgent, initializeAgent };