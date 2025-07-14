document.addEventListener("DOMContentLoaded", function () {
  // const dataList = document.getElementById("data-list");
  const twitterUsername = document.getElementById("twitter-username");

  const userIdElement = document.getElementById("user-id");
  const walletAddressElement = document.getElementById("wallet-address");

  // Sample Key-Value pairs stored in chrome.storage
  // const defaultData = {
  //   feature1: true,
  //   feature2: false,
  //   feature3: true,
  // };

  // Initialize storage if not set
  chrome.storage.sync.get(["settings"], (result) => {
    let settings = result.settings || defaultData;

    // Save default data if empty
    if (!result.settings) {
      chrome.storage.sync.set({ settings: defaultData });
    }

    // Display key-value pairs
    // for (let key in settings) {
    //   let item = document.createElement("div");
    //   item.classList.add("item");

    //   let label = document.createElement("span");
    //   label.textContent = key;

    //   let toggle = document.createElement("input");
    //   toggle.type = "checkbox";
    //   toggle.checked = settings[key];

    //   toggle.addEventListener("change", () => {
    //     settings[key] = toggle.checked;
    //     chrome.storage.sync.set({ settings });
    //   });

    //   item.appendChild(label);
    //   item.appendChild(toggle);
    //   dataList.appendChild(item);
    // }
  });

  // Retrieve Twitter username stored from content script
  chrome.storage.sync.get(["twitterUsername"], async (result) => {
    if (result.twitterUsername) {
      twitterUsername.textContent = result.twitterUsername;
      const twitterId = result.twitterUsername;

      chrome.runtime.sendMessage({
        type: "TWITTER_USERNAME",
        username: result.twitterUsername,
      });

      console.log("Twitter ID:", twitterId, "fetching account details");
      // Fetch account details
      let accountDetails = await fetchAccountDetails(twitterId);

      if (!accountDetails) {
        console.log("User not found, registering...");
        await registerUser(twitterId);
        accountDetails = await fetchAccountDetails(twitterId);
      }

      // Display user details
      if (accountDetails) {
        userIdElement.setAttribute("data-full", accountDetails.useruuid);
        walletAddressElement.setAttribute(
          "data-full",
          accountDetails.cdpWalletAddress
        );

        userIdElement.textContent = accountDetails.useruuid;
        walletAddressElement.textContent = accountDetails.cdpWalletAddress;

        // userIdElement.textContent = sliceText(accountDetails.useruuid);
        // walletAddressElement.textContent = sliceText(
        //   accountDetails.cdpWalletAddress
        // );
      }
    } else {
      twitterUsername.textContent = "Not found";
    }
  });
});

// Function to fetch account details
const fetchAccountDetails = async (twitterId) => {
  try {
    const res = await fetch("http://localhost:8000/getUserInfoFromTwitterId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ twitterId }),
    });

    const data = await res.json();
    if (!res.ok) return null;

    return data;
  } catch (error) {
    console.error("Error fetching account details:", error);
    return null;
  }
};

// Function to register a new user
const registerUser = async (twitterId) => {
  try {
    const res = await fetch("http://localhost:8000/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ twitterId }),
    });

    if (!res.ok) {
      console.error("Error registering user:", await res.text());
      return false;
    }

    console.log("User registered successfully.");
    return true;
  } catch (error) {
    console.error("Error registering user:", error);
    return false;
  }
};
