import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAccount,
  useConnect,
  useContract,
  // useDisconnect,
  useSendTransaction,
} from "@starknet-react/core";
import { useMemo, useState } from "react";
import { starknetCounterAbi } from "@/lib/starknetAbi";

interface DonationStarknetProps {
  bgColor: string;
  imageUrl?: string; // Optional prop for image URL
  heading: string;
  text: string;
  buttonColor: string;
  btnText: string;
  recieverAddress: string;
}

function DonationStarknet({
  bgColor,
  imageUrl, // Default image if no URL is provided
  heading,
  text,
  buttonColor,
  btnText,
  recieverAddress,
}: DonationStarknetProps) {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  // const { disconnect } = useDisconnect({});

  const testAddress =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

  const [ethAmount, setEthAmount] = useState<string>("0");

  const { contract } = useContract({
    abi: starknetCounterAbi as any,
    address: testAddress,
  });

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    try {
      // return [contract.populate("set_count", [BigInt(679)])];

      // convert eth to wei

      console.log("reciverAddress", recieverAddress);

      console.log("ethAmount", ethAmount);

      const val = parseFloat(ethAmount);

      return [
        contract.populate("transfer", [
          recieverAddress,
          BigInt(val * 10 ** 18), // this requires number input in wei
        ]),
      ];
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [contract, ethAmount, address, recieverAddress]);

  const { send: writeAsync } = useSendTransaction({
    calls: calls,
  });

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
              if (address) {
                writeAsync();
              } else {
                connectors.length > 0 ? (
                  connectors.map((connector, index) =>
                    connectors[index].id == "argentX" ? (
                      connect({ connector })
                    ) : (
                      <></>
                    )
                  )
                ) : (
                  <></>
                );
              }
            }}
          >
            {address ? btnText : "Connect with ArgentX "}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DonationStarknet;
