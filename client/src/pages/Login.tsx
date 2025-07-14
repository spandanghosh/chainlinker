import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ArrowRight, Loader, Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import {useUser} from "@/context/socioAgentContext"; // Import useUser
import {useNavigate} from "react-router-dom";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {user, userLogin} = useUser(); // Get userLogin function from context
  const [uuid, setUuid] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.twitterId) {
      console.log("User already logged in:", user);
      navigate("/"); // Redirect to home
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await userLogin({uuid, walletAddress}); // Call userLogin with user input
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div
        className={cn("flex flex-col gap-6 w-[450px]", className)}
        {...props}
      >
        <Card>
          <CardHeader className="text-center">
            <p
              className="bricolage-grotesque-800"
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#6E23DD",
              }}
            >
              SocioAgent
            </p>

            <CardTitle className="text-xl bricolage-grotesque-font">
              Sign in to your account
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="uuid">UUID</Label>
                    <Input
                      id="uuid"
                      type="text"
                      placeholder="Enter your UUID"
                      required
                      className="h-[40px]"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input
                      id="walletAddress"
                      type="text"
                      required
                      className="h-[40px]"
                      placeholder="Enter your Wallet Address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bricolage-grotesque-font border-2 border-black group"
                    variant={"outline"}
                  >
                    <span>Login and Go to Dashboard</span>
                    <ArrowRight className="group-hover:transition-all duration-150 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
