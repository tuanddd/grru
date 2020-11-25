export type Request = { type: Operation; payload: any };
export const GITLAB_RELEASE_BLOCK_CLASSNAME = "release-block";
export const DELETE_RELEASE = "delete-release";
export const ON_RELEASES_FETCH_COMPLETED = "on-releases-fetch-completed";
export const GITLAB_LIST_RELEASES_API_PATTERN =
  "*://*/api/v4/projects/*/releases*";
export const GITLAB_LIST_RELEASES_API_GRAPHQL_PATTERN = "*://*/api/graphql*";
export const GITLAB_MEMBERS_API = "api/v4/projects/:id/members/all";
export const GITLAB_CURRENT_USER_API = "api/v4/user";
export type Operation = "on-releases-fetch-completed" | "delete-release";
export const CSRF_TOKEN_KEY = "X-CSRF-Token";
export const REQUESTED_WITH_KEY = "X-Requested-With";
export const ACCESS_LEVEL_REQUIRED = 30; // https://docs.gitlab.com/ee/api/access_requests.html
