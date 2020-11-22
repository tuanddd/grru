import {
  CSRF_TOKEN_KEY,
  GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN,
  GITLAB_LIST_RELEASES_API_PATTERN,
  ON_RELEASES_FETCH_COMPLETED,
  Request,
  REQUESTED_WITH_KEY,
} from "const";

let extraHeaders = {
  [CSRF_TOKEN_KEY]: "",
  [REQUESTED_WITH_KEY]: "XMLHttpRequest",
};

chrome.runtime.onMessage.addListener((request: Request, _, respond) => {
  switch (request.type) {
    case "delete-release":
      fetch(
        `${request.payload.origin}/api/v4/projects/${encodeURIComponent(
          request.payload.projectId
        )}/releases/${request.payload.tagName}`,
        {
          method: "DELETE",
          headers: {
            ...extraHeaders,
          },
        }
      ).finally(() => respond());
      break;
    default:
      break;
  }
  return true;
});

chrome.webRequest.onCompleted.addListener(
  () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.tabs.sendMessage(tab.id as number, {
        type: ON_RELEASES_FETCH_COMPLETED,
      });
    });
  },
  {
    urls: [
      GITLAB_LIST_RELEASES_API_PATTERN,
      GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN,
    ],
    types: ["xmlhttprequest"],
  },
  []
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ requestHeaders }) => {
    requestHeaders?.forEach((h) => {
      if (h.name.toLowerCase() === CSRF_TOKEN_KEY.toLowerCase()) {
        console.log("csrf-token found");
        extraHeaders[CSRF_TOKEN_KEY] = h.value as string;
      }
    });
  },
  {
    urls: [
      GITLAB_LIST_RELEASES_API_PATTERN,
      GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN,
    ],
    types: ["xmlhttprequest"],
  },
  ["requestHeaders", "extraHeaders"]
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.includes("/-/releases") && changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, { type: ON_RELEASES_FETCH_COMPLETED });
  }
});

export {};
