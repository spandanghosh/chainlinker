import {Button} from "@/components/ui/button";
import {Wallet} from "lucide-react";

interface ConnectWalletProps {
  onConnect: () => void;
}

export function ConnectWallet({onConnect}: ConnectWalletProps) {
  return (
    <Button
      onClick={onConnect}
      className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
    >
      <Wallet className="mr-2 h-5 w-5" />
      Connect Ethereum Wallet
    </Button>
  );
}
