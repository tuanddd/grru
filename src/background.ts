import {
  CSRF_TOKEN_KEY,
  GITLAB_MEMBERS_API,
  GITLAB_CURRENT_USER_API,
  GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN,
  GITLAB_LIST_RELEASES_API_PATTERN,
  ON_RELEASES_FETCH_COMPLETED,
  Request,
  REQUESTED_WITH_KEY,
  ACCESS_LEVEL_REQUIRED,
} from "const";
import { getProjectId } from "utils";

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

function getCurrentUser(url: URL) {
  return new Promise<number>((resolve) =>
    fetch(`${url.origin}/${GITLAB_CURRENT_USER_API}`).then((res) =>
      res.json().then((json) => resolve(json.id))
    )
  );
}

function getAccessLevelOfUser(userId: number, url: URL) {
  return new Promise<number | null>((resolve) => {
    const projectId = encodeURIComponent(`${getProjectId(url)}`);
    fetch(`${url.origin}/${GITLAB_MEMBERS_API.replace(":id", projectId)}?user_ids=${userId}`).then(
      (res) =>
        res.json().then((json) => {
          const user = json.find((u: any) => u.id === userId);
          resolve(user?.access_level ?? null);
        })
    );
  });
}

function canRemoveRelease() {
  return new Promise((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const [tab] = tabs;
      const { url: rawURL } = tab;
      if (!rawURL) return;
      const url = new URL(rawURL);
      getCurrentUser(url)
        .then((userId) => getAccessLevelOfUser(userId, url))
        .then((accessLevel) => {
          if (accessLevel === null || accessLevel < ACCESS_LEVEL_REQUIRED)
            resolve(false);
          resolve(true);
        });
    })
  );
}

function notifyReleasesFetched(tabId: number) {
  canRemoveRelease().then((canRemove) =>
    chrome.tabs.sendMessage(tabId, {
      type: ON_RELEASES_FETCH_COMPLETED,
      payload: { canRemove },
    })
  );
}

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

function notify(details: chrome.webRequest.WebResponseCacheDetails) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [tab] = tabs;
    notifyReleasesFetched(tab.id as number);
  });
  chrome.webRequest.onCompleted.removeListener(notify);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "loading") return;
  chrome.webRequest.onCompleted.addListener(
    notify,
    {
      urls: [
        GITLAB_LIST_RELEASES_API_PATTERN,
        GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN,
      ],
      tabId: tab.id,
      types: ["xmlhttprequest", "main_frame"],
    },
    []
  );
});

export {};
