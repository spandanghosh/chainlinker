import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./components/ui/input";
import { ArrowRight, Fingerprint, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "./context/socioAgentContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    "github" | "google" | "twitter" | ""
  >("");

  const { user } = useUser(); // Get userLogin function from context

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.twitterId == "") {
      navigate("/login"); // Redirect to home
    }
  }, [user, navigate]);

  return (
    <div className="h-screen w-full flex">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border-2 border-black bg-[#b9c3fa]">
          <DialogHeader>
            <DialogTitle>Link Your Account</DialogTitle>
            <DialogDescription>
              <p className="text-black">
                Please select the provider you would like to connect with from
                the options below. Once you have selected a provider, enter your
                username associated with that provider to link your account
                seamlessly.
              </p>
            </DialogDescription>
            <div className="py-6 flex flex-col gap-4">
              <Select
                onValueChange={(value) =>
                  setSelectedOption(
                    value as "github" | "google" | "twitter" | ""
                  )
                }
                value={selectedOption}
              >
                <SelectTrigger
                  className="w-full bg-white border border-black"
                  style={{
                    height: "40px",
                  }}
                >
                  <SelectValue placeholder="Select the provider" />
                </SelectTrigger>
                <SelectContent className="bricolage-grotesque-500 bg-white">
                  <SelectItem value="google">
                    <div className="flex items-center w-full gap-2">
                      <img src="/google.png" alt="google" className="h-4 w-4" />
                      <p>Google</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="twitter">
                    <div className="flex items-center w-full gap-2">
                      <img
                        src="/twitter.png"
                        alt="twitter"
                        className="h-4 w-4"
                      />
                      <p>Twitter</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="github">
                    <div className="flex items-center w-full gap-2">
                      <img src="/github.png" alt="github" className="h-4 w-4" />
                      <p>GitHub</p>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedOption === "google" ? (
                <div className="relative h-fit w-full ">
                  <img
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 h-3 w-3"
                    src="/google.png"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your Google ID"
                    className="bg-white  border border-black pl-9 pr-3 py-2 text-md w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
                    value=""
                  />
                </div>
              ) : selectedOption === "twitter" ? (
                <div className="relative h-fit w-full ">
                  <img
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 h-3 w-3"
                    src="/twitter.png"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your Twitter ID"
                    className="bg-white  border border-black pl-9 pr-3 py-2 text-md w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
                    value=""
                  />
                </div>
              ) : (
                selectedOption === "github" && (
                  <div className="relative h-fit w-full ">
                    <img
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 h-3 w-3"
                      src="/github.png"
                    />
                    <Input
                      type="text"
                      placeholder="Enter your GitHub ID"
                      className="bg-white  border border-black pl-9 pr-3 py-2 text-md w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
                      value=""
                    />
                  </div>
                )
              )}
            </div>

            {selectedOption !== "" && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full bricolage-grotesque-500 border-2 border-black group"
                  style={{
                    fontSize: "1rem",
                  }}
                  variant={"outline"}
                  onClick={() => setOpen(false)}
                >
                  <span className="">Link Account</span>
                  <ArrowRight className="group-hover:transition-all duration-150 group-hover:translate-x-1" />
                </Button>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template</DialogTitle>
            <DialogDescription className="p-7 relative">
              <motion.div
                transition={{ duration: 0.7 }}
                animate={{ rotateY: flip ? 0 : 180 }}
              >
                <motion.div
                  transition={{ duration: 0.7 }}
                  animate={{ rotateY: flip ? 0 : 180 }}
                  onClick={() => setFlip(!flip)}
                  // style={{
                  //   backfaceVisibility: "hidden",
                  // }}
                >
                  <img src="/template-1.png" alt="template-1" />
                </motion.div>
                <motion.div
                  transition={{ duration: 0.7 }}
                  animate={{ rotateY: flip ? 0 : 180 }}
                  onClick={() => setFlip(!flip)}
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                  className="absolute top-0 left-0 w-full h-full bg-white flex justify-center items-center"
                >
                  <p>
                    {`  
                      <emb bafkreieadnct3nrujqc2ta726xipdfz6fcy2sgxznm2kyzvdqlzjpwxvqq emb>
                      
                    `}
                  </p>
                </motion.div>
              </motion.div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="h-full w-1/5 border-r flex flex-col items-start px-6 gap-4">
        <div className="pl-9 pt-5">
          <p
            className="bricolage-grotesque-800"
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#6E23DD",
            }}
          >
            SocioAgent
          </p>
        </div>

        <div className="h-12 w-full mt-7 flex justify-between items-center px-3 pr-5 border-2 border-black rounded-xl group cursor-pointer">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 mr-1" />
            <span>Dashboard</span>
          </div>

          <ArrowRight className="h-5 w-5 group-hover:translate-x-2 duration-150 ease-in-out" />
        </div>
      </div>
      <div className="h-full w-4/5 flex flex-col pt-4 gap-4 px-7">
        <div>
          <p
            className="bricolage-grotesque-500 mb-5"
            style={{
              fontSize: "1.5rem",
            }}
          >
            {/* Hello ! */}
          </p>
        </div>
        <div>
          <p
            className="bricolage-grotesque-900"
            style={{
              fontSize: "2.5rem",
            }}
          >
            Dashboard
          </p>
        </div>

        <div className="w-full mt-4 h-fit flex gap-2">
          <div className="w-1/2 h-fit border rounded-xl gap-3 bricolage-grotesque-300 bg-white pl-4 py-6 flex flex-col">
            <div className="flex items-center justify-between px-6 pl-2">
              <p className="text-lg font-normal">AI Agent Wallet</p>
              <img
                src="/coinbase.png"
                alt="coinbase"
                className="h-8 w-8 font-serif"
              />
            </div>
            <p className="text-2xl font-semibold ml-2">
              {" "}
              {user?.walletAddress.slice(0, 10)}...{" "}
              {user?.walletAddress.slice(-10)}{" "}
            </p>
          </div>
          <div className="w-1/2 h-fit border rounded-xl gap-3 bricolage-grotesque-300 bg-white pl-4 py-6 flex flex-col">
            <div className="flex items-center justify-between px-6 pl-2">
              <p className="text-lg font-normal">UUID</p>

              <Fingerprint className="h-7 w-7 font-serif" />
            </div>
            <p className="text-2xl font-semibold ml-2">{user?.uuid}</p>
          </div>
        </div>
        <div className="w-full mt-4 lg:h-[55%] h-full flex gap-3 flex-col lg:flex-row">
          <Card className="lg:w-1/2 h-full rounded-none flex flex-col gap-3 border shadow-none w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <p
                    className="bricolage-grotesque-600"
                    style={{
                      fontSize: "1.2rem",
                    }}
                  >
                    Linked Accounts
                  </p>

                  <Button
                    className="rounded-xl py-2 px-5"
                    variant={"outline"}
                    onClick={() => setOpen(true)}
                  >
                    Add Account
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-3 items-center border-2 border-gray-600 rounded-xl py-5 px-5">
                <img src="/twitter.png" alt="twitter" className="h-11 w-11" />
                <div className="flex flex-col justify-center items-start">
                  <p className="bricolage-grotesque-600">Twitter</p>
                  <p>{user?.twitterId}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center border-2 border-[#4285F4] rounded-xl py-5 px-5">
                <img src="/google.png" alt="google" className="h-11 w-11" />
                <div className="flex flex-col justify-center items-start">
                  <p className="bricolage-grotesque-600">Google</p>
                  <p>{"not linked"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:w-1/2 h-full rounded-none flex flex-col gap-3 border shadow-none w-full">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <p
                    className="bricolage-grotesque-600"
                    style={{
                      fontSize: "1.2rem",
                    }}
                  >
                    Generated Templates
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 w-full">
              <div className="flex gap-3 items-center justify-between rounded-xl">
                <div className="flex items-center gap-3">
                  <img src="/template-1.png" alt="twitter" className="h-16" />

                  <div className="flex flex-col justify-center items-start">
                    <p className="bricolage-grotesque-600">Donation Template</p>
                    <p>{user.twitterId}</p>
                  </div>
                </div>
                <Button
                  variant={"outline"}
                  className="rounded-xl py-2 px-5"
                  onClick={() => setViewModalOpen(true)}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* <Tabs defaultValue="linkedAcc" className="w-full">
            <TabsList>
              <TabsTrigger value="linkedAcc">Linked Accounts</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="linkedAcc">
              <div className="w-full h-[90px] flex justify-between items-center rounded-xl bg-gray-300">

              </div>
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs> */}
        </div>
      </div>
    </div>
  );
}
