import { DELETE_RELEASE } from "const";

const removeButton = document.createElement("button");
removeButton.classList.add(
  "btn",
  "gl-button",
  "btn-danger",
  "btn-icon",
  "gl-mr-3"
);
removeButton.type = "button";

const span = document.createElement("span");

export default ({
  projectId,
  tagName,
  content,
  disabled = false,
}: {
  projectId: string | number;
  tagName: string;
  content: string;
  disabled?: boolean;
}) => {
  const cloned = removeButton.cloneNode(true) as HTMLButtonElement;
  const clonedSpan = span.cloneNode(true);

  clonedSpan.textContent = content;
  cloned.appendChild(clonedSpan);
  cloned.disabled = disabled;
  if (disabled) {
    cloned.classList.add("disabled");
  }
  cloned.dataset.grruTagname = tagName;

  cloned.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;
    const spinnerContainer = document.createElement("span");
    const spinner = document.createElement("span");
    spinnerContainer.classList.add(
      "gl-spinner-container",
      "gl-button-icon",
      "gl-button-loading-indicator"
    );
    spinner.setAttribute("aria-label", "Loading");
    spinner.classList.add(
      "align-text-botom",
      "gl-spinner",
      "gl-spinner-light",
      "gl-spinner-sm"
    );
    spinnerContainer.appendChild(spinner);

    target.firstChild!.textContent = "Loading";
    target.insertBefore(spinnerContainer, target.firstChild);

    const proceed = confirm("Are you sure about this?");
    if (proceed) {
      chrome.runtime.sendMessage(
        {
          type: DELETE_RELEASE,
          payload: { origin: window.location.origin, projectId, tagName },
        },
        () => {
          target.removeChild(spinnerContainer);
          target.firstChild!.textContent = content;
          window.location.replace(
            `${window.location.href.split("/-/")[0]}/-/releases`
          );
        }
      );
    }
  });

  return cloned;
};
