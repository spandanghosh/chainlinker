const getFocusedElementPrompt = async () => {
  // Get the focused element
  const focusedElement = document.activeElement;
  let prompt = focusedElement.innerText;

  prompt = prompt.split("->")[0].trim();

  const cleanedPrompt = prompt.replace(/->$/, "").trim();

  console.log("Prompt: ", cleanedPrompt);

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Required for JSON parsing in Express
      },
      body: JSON.stringify({ prompt: cleanedPrompt }),
    });

    const data = await res.json();
    console.log("Data: ", data);

    // const parsedMessage = JSON.parse(data.message);

    // console.log("Parsed Message: ", parsedMessage);
    // console.log("Response: ", parsedMessage.response);

    let newSpan = document.createElement("span");
    newSpan.id = "responseSpan";

    if (focusedElement.contains(document.getElementById("responseSpan"))) {
      focusedElement.removeChild(document.getElementById("responseSpan"));
    }
    focusedElement.appendChild(newSpan);
    newSpan.innerText = data.message;
  } catch (error) {
    console.log("Error: ", error);
  }

  console.log("Prompt: ", prompt);
};

async function replaceEmbTags() {
  // Find all span elements containing <emb ... emb> or &lt;emb ... emb&gt;

  // const focusedElement = document.activeElement; // Get the focused element

  // if (focusedElement) {
  //   // Check if a button with id "myBtn" already exists inside the span
  //   if (
  //     focusedElement.innerText != "" &&
  //     !focusedElement.querySelector("#myBtn")
  //   ) {
  //     const btn = document.createElement("button");
  //     btn.id = "myBtn";
  //     btn.innerText = "->";
  //     btn.style.marginTop = "5px"; // Add some spacing
  //     btn.onclick = getFocusedElementPrompt; // Call the function when the button is clicked

  //     // Append the button to the focused span
  //     focusedElement.appendChild(btn);
  //   }
  // }
  console.log("Inside replaceEmbTags");
  const spans = document.querySelectorAll("span");
  // console.log("Spans: ", spans);

  spans.forEach((span) => {
    const embRegex = /<emb\s*([^<]*)\s*emb>/g;
    let match;
    const decodedHTML = span.innerHTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

    while ((match = embRegex.exec(decodedHTML)) !== null) {
      const match1 = match;

      console.log("MATCHHHHH: ", match1);

      const url1 = match[1].trim();
      console.log("URL1: ", url1);

      const defaultResponse = {
        span: "defaultSpan",
        match: "defaultMatch",

        htmlText: `<html>

      <head>
          <title>Parent Page with iframe</title>
          <style>
              .iframe-container {
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  // max-width: 800px;
                  // margin: 20px auto;
                  // border: 1px solid #ccc;
              }

              iframe {
                width: 400px;
                height: 500px;
                border: none;
                border-radius: 15px;
              }
          </style>
      </head>

      <body>
          <div class="iframe-container">
              <iframe src="http://localhost:5173/template/${url1}" title="Embedded React App"
                  allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
                  sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
          </div>
      </body>

      </html>
      `,
        jsCode: ``,
      };

      // add html content
      span.innerHTML = defaultResponse.htmlText;
    }
  });
}

// Run the function every 1 second

function getUsername() {
  const avatarContainer = document.querySelector(
    "[data-testid^='UserAvatar-Container-']"
  );

  if (avatarContainer) {
    const dataTestId = avatarContainer.getAttribute("data-testid");
    const username = dataTestId.replace("UserAvatar-Container-", ""); // Remove prefix
    console.log("Username:", username);

    // Store username in chrome.storage for use in popup.js
    chrome.storage.sync.set({ twitterUsername: username });
  } else {
    console.log("User avatar not found");
  }
}

// MutationObserver to detect when the avatar container is added to the DOM
const observer = new MutationObserver(() => {
  if (document.querySelector("[data-testid^='UserAvatar-Container-']")) {
    getUsername();
    observer.disconnect(); // Stop observing after we get the username
  }
});

// Start observing changes in the body
observer.observe(document.body, { childList: true, subtree: true });

// Run once in case the element is already present

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTweetText") {
    console.log("Inside getTweetText -- content");
    let tweetElement = document.querySelector('[data-testid="tweetText"]');

    const url = window.location.href;
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);

    if (pathSegments.length === 3 && pathSegments[1] === "status") {
      if (tweetElement) {
        let tweetText = tweetElement.innerText;
        sendResponse({ tweetText }); // Send response directly
      } else {
        sendResponse({ tweetText: "No tweet found" });
      }
    } else {
      sendResponse({ tweetText: "" });
    }
  }

  if (request.action === "replaceText") {
    console.log("inside content replaceText");
    const { newText } = request;

    let tweetBox = document.evaluate(
      "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div[2]/div[1]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div/div/div/div/div/span/span",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (!tweetBox) {
      tweetBox = document.evaluate(
        "/html/body/div[1]/div/div/div[2]/main/div/div/div/div/div/section/div/div/div[1]/div[1]/div/div/div/div/div[2]/div[2]/div/div/div/div[2]/div[1]/div/div/div/div/div/div/div/div/div/div/div/div[1]/div/div/div/div/div/div/div/div/div/div/span/span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    }

    if (tweetBox) {
      tweetBox.innerText = newText;
      tweetBox.dispatchEvent(new Event("input", { bubbles: true }));

      sendResponse({ success: true });
    } else {
      console.log("Tweet box not found");
      sendResponse({ success: false, error: "Tweet box not found" });
    }
  }

  return true; // Required to keep sendResponse alive for async calls
});

getUsername();
console.log("Running replaceEmbTags");
setInterval(replaceEmbTags, 1000);
