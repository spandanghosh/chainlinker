import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    ethereum: any;
  }
}

import { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { EmbedlyContext } from "@/context/contractContext";

interface DonationEtheriumProps {
  chain: string;
  bgColor: string;
  imageUrl?: string; // Optional prop for image URL
  heading: string;
  text: string;
  buttonColor: string;
  btnText: string;
  recieverAddress: string;
}

function DonationEtherium({
  chain,
  bgColor,
  imageUrl, // Default image if no URL is provided
  heading,
  text,
  buttonColor,
  btnText,
  recieverAddress,
}: DonationEtheriumProps) {
  const [ethAmount, setEthAmount] = useState<string>("0");
  //   const { currentAccount, connectWallet } = useContext(EmbedlyContext);

  const [chainId, setChainId] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<string>("");

  const { ethereum } = window;

  useEffect(() => {
    if (chain == "BaseSepolia") {
      setChainId("0x14a34");
    }
  }, [chain]);

  useEffect(() => {
    if (!ethereum) {
      console.log("Metamask not found");
      return;
    }

    // Define handlers
    const handleAccountsChanged = (accounts: string[]) => {
      setCurrentAccount(accounts[0]);
    };

    const handleChainChanged = (chainId: string) => {
      console.log("Chain ID:", chainId);
      window.location.reload();
    };

    // Handle account change
    ethereum.on("accountsChanged", handleAccountsChanged);

    // Handle chain change
    ethereum.on("chainChanged", handleChainChanged);

    // Cleanup on unmount
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [ethereum]);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (!ethereum) {
          console.log("Metamask not found");
          return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        } else {
          setCurrentAccount("");
        }

        const currChainId = await ethereum.request({ method: "eth_chainId" });
        setChainId(currChainId);
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, []); // Dependency array with an empty array means it runs only once, after component mounts

  const connectWallet = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const switchNetwork = async (chainId: string) => {
    try {
      if (ethereum) {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainId }], // Hexadecimal chainId
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Chain ID:", chainId);
    switchNetwork(chainId);
    // if (chainId !== "0x13fb" && ethereum) {
    //   console.log("Switching network");
    // }
  }, [chainId]); // Dependency array now includes only chainId

  const sendEth = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // Ensure the amount is valid
      if (isNaN(Number(ethAmount)) || Number(ethAmount) <= 0) {
        alert("Please enter a valid ETH amount.");
        return;
      }

      //   setIsSending(true);

      // Connect to MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request accounts
      const signer = provider.getSigner();

      // Send transaction
      const tx = await signer.sendTransaction({
        to: recieverAddress,
        value: ethers.utils.parseEther(ethAmount), // Convert ETH to wei
      });

      console.log("Transaction sent:", tx);
      alert(`Transaction successful! Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send transaction.");
    } finally {
      //   setIsSending(false);
    }
  };

  console.log("currentAccount", currentAccount);
  console.log("chainId", chainId);
  console.log("chain", chain);

  return (
    <div className="flex justify-center">
      <div
        className=" p-6 "
        style={{ backgroundColor: bgColor, height: "500px", width: "400px" }}
      >
        {/* Image Section */}
        <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt="Donation"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Text Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">{heading}</h2>
          <p className="text-sm text-gray-600 mt-2">{text}</p>
        </div>

        {/* Input Section */}
        <div className="mt-4">
          <label
            htmlFor="donation-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <Input
            type="text"
            id="donation-amount"
            placeholder="Enter amount in ETH"
            className="mt-2 w-full"
            value={ethAmount}
            onChange={(e) => {
              console.log("ethAmount", e.target.value);
              setEthAmount(e.target.value);
            }}
          />
        </div>

        {/* Button Section */}
        <div className="mt-4">
          <Button
            className="w-full"
            style={{ backgroundColor: buttonColor, color: "#fff" }}
            onClick={() => {
              if (currentAccount) {
                sendEth();
              } else {
                connectWallet();
              }
            }}
          >
            {currentAccount ? btnText : "Connect with Metamask"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DonationEtherium;
