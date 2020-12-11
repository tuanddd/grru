import { GITLAB_RELEASE_BLOCK_CLASSNAME, Request } from "const";
import RemoveButton from "button";
import { getProjectId } from "utils";

function scan(canRemove: boolean) {
  const blocks = document.querySelectorAll<HTMLDivElement>(
    `.${GITLAB_RELEASE_BLOCK_CLASSNAME}`
  );
  if (blocks.length === 0) {
    console.log("[Gitlab Relase Remover UI] No Release found, exiting...");
    return;
  }

  blocks.forEach((b) => {
    const existed = document.querySelector(
      `button[data-grru-tagname='${b.id}']`
    );
    if (existed) return;
    const url = new URL(window.location.href);
    b.firstChild?.appendChild(
      RemoveButton({
        projectId: `${getProjectId(url)}`,
        tagName: b.id,
        content: canRemove ? "Delete" : "Your role is not allowed to delete",
        disabled: !canRemove,
      })
    );
  });
}

chrome.runtime.onMessage.addListener(function (request: Request, _1, _2) {
  switch (request.type) {
    case "on-releases-fetch-completed":
      scan(request.payload.canRemove);
      break;
    default:
      break;
  }
  return true;
});
