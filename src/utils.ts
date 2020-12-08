export function getProjectId(url: URL) {
  const pathnameArr = url.pathname.split("/");
  const dashIndex = pathnameArr.findIndex((c) => c === "-");
  const projectsAndGroupsName = pathnameArr.slice(1, dashIndex);
  return projectsAndGroupsName.join("/");
}
