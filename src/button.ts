import { DELETE_RELEASE } from "const";

const removeButton = document.createElement("button");
removeButton.classList.add(
  "btn",
  "gl-button",
  "btn-danger",
  "btn-icon",
  "gl-mr-3"
);
removeButton.textContent = "Delete";
removeButton.type = "button";

export default (projectId: string | number, tagName: string) => {
  const cloned = removeButton.cloneNode(true) as HTMLButtonElement;

  cloned.dataset.grruTagname = tagName;

  cloned.addEventListener("click", (e) => {
    e.preventDefault();
    const proceed = confirm("Are you sure about this?");
    if (proceed) {
      chrome.runtime.sendMessage(
        {
          type: DELETE_RELEASE,
          payload: { origin: window.location.origin, projectId, tagName },
        },
        () =>
          window.location.replace(
            `${window.location.href.split("/-/")[0]}/-/releases`
          )
      );
    }
  });

  return cloned;
};
