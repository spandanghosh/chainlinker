import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Twitter, Facebook, Instagram} from "lucide-react";

interface ConnectSocialProps {
  onConnect: () => void;
}

export function ConnectSocial({onConnect}: ConnectSocialProps) {
  const [socialPlatform, setSocialPlatform] = useState<
    "twitter" | "facebook" | "instagram" | null
  >(null);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          variant={socialPlatform === "twitter" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setSocialPlatform("twitter")}
        >
          <Twitter className="mr-2 h-4 w-4" /> Twitter
        </Button>
        <Button
          variant={socialPlatform === "facebook" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setSocialPlatform("facebook")}
        >
          <Facebook className="mr-2 h-4 w-4" /> Facebook
        </Button>
        <Button
          variant={socialPlatform === "instagram" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setSocialPlatform("instagram")}
        >
          <Instagram className="mr-2 h-4 w-4" /> Instagram
        </Button>
      </div>
      <Input
        type="text"
        placeholder="Enter your social media handle"
        className="bg-white/50 border-teal-300 focus:border-teal-500 text-teal-900 placeholder-teal-400"
      />
      <Button
        onClick={onConnect}
        className="w-full bg-gradient-to-r from-blue-400 to-teal-500 hover:from-blue-500 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Connect Social Account
      </Button>
    </div>
  );
}
