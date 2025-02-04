import type { User, UserResponse } from 'key/types/github-rest';

function trimUserData(userData: UserResponse): User {
  return {
    name: userData.name,
    login: userData.login,
    html_url: userData.html_url,
    avatar_url: userData.avatar_url,
  };
}

export { trimUserData };
