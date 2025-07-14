import useGlobalContext from "./Context/useGlobalContext";
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("flow.network", "testnet")
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("app.detail.title", "Test Harness")
  .put("app.detail.icon", "https://i.imgur.com/r23Zhvu.png")
  .put("app.detail.description", "A test harness for FCL")
  .put("app.detail.url", "https://myapp.com")
  .put("0xFlowToken", "0x7e60df042a9c0868");

export default function Test() {
  const {user, logOut, logIn} = useGlobalContext();
  return (
    <div>
      <div>
        <h1>FCL App Quickstart</h1>
        {user.loggedIn ? (
          <div>
            {/* @ts-ignore */}
            <p>Address: {user.addr}</p>
            <button onClick={logOut}>Log Out</button>
            <div></div>
          </div>
        ) : (
          <button
            onClick={() => {
              fcl.authenticate();
            }}
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
}
