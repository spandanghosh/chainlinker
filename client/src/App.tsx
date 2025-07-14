import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Template from "./pages/Template";
import { Auth0Provider } from "@auth0/auth0-react";
import { LoginForm } from "./pages/Login";
import { StarknetProvider } from "./StarknetProvider";
import { UserProvider, useUser } from "@/context/socioAgentContext"; // Import UserProvider

function App() {
  const { user } = useUser();

  console.log("User: -- context", user);

  return (
    <>
      <Auth0Provider
        domain="jaydeepdey03.us.auth0.com"
        clientId="v9616XkYtln4wkMxXh8eH3LaJQbxnZyd"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <StarknetProvider>
          <UserProvider>
            {" "}
            {/* Wrap the app with UserProvider */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="*" element={<div>Not Found</div>} />
                <Route path="/template/:id" element={<Template />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </StarknetProvider>
      </Auth0Provider>
    </>
  );
}

export default App;
