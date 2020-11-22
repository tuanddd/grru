import { GITLAB_RELEASE_BLOCK_CLASSNAME, Request } from "const";
import RemoveButton from "button";

function scan() {
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
    const [, group, project] = window.location.pathname.split("/");
    b.firstChild?.appendChild(RemoveButton(`${group}/${project}`, b.id));
  });
}

let timer: number;

chrome.runtime.onMessage.addListener(function (request: Request, _1, _2) {
  switch (request.type) {
    case "on-releases-fetch-completed":
      clearTimeout(timer);
      timer = setTimeout(scan, 1000);
      break;
    default:
      break;
  }
  return true;
});
