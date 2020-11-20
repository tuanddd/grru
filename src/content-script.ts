import { GITLAB_RELEASE_BLOCK_CLASSNAME, Request, GET_PROJECT_ID } from "const";
import RemoveButton from "button";

let projectId: string | number;

function scan() {
  // ProjectId not found
  if (!projectId) {
    console.error("No project id found, exiting...");
    return;
  }
  // No Release found
  const blocks = document.querySelectorAll<HTMLDivElement>(
    `.${GITLAB_RELEASE_BLOCK_CLASSNAME}`
  );
  if (blocks.length === 0) {
    console.error("No Release found, exiting...");
    return;
  }

  blocks.forEach((b) => {
    const existed = document.querySelector(
      `button[data-grru-tagname='${b.id}']`
    );
    if (existed) return;
    b.firstChild?.appendChild(RemoveButton(projectId, b.id));
  });
}

function getProjectId() {
  return new Promise<void>((resolve) => {
    const [group, repo] = window.location.pathname.substring(1).split("/");
    chrome.runtime.sendMessage(
      {
        type: GET_PROJECT_ID,
        payload: {
          origin: window.location.origin,
          name: `${group}/${repo}`,
        },
      },
      (res) => {
        projectId = res;
        resolve();
      }
    );
  });
}

chrome.runtime.onMessage.addListener(function (request: Request, _1, _2) {
  switch (request.type) {
    case "on-releases-fetch-completed":
      getProjectId().then(scan);
      break;
    default:
      break;
  }
  return true;
});
