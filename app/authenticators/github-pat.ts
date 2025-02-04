import Base from 'ember-simple-auth/authenticators/base';
import { Promise } from 'rsvp';
import type { User, UserResponse } from 'key/types/github-rest';
import type { SessionData } from 'key/types/auth';
import { trimUserData } from 'key/utils.ts/github-rest';

export const Authenticator = 'authenticator:github-pat';
export type AuthenticatorType = typeof Authenticator;

export default class GithubPatAuthenticator extends Base {
  /**
   * Authenticates with GitHub using a single Personal Access Token (PAT).
   * If valid, it stores the token in an array to allow adding more tokens later.
   *
   * @param {String} token - The GitHub Personal Access Token.
   * @returns {Promise<Object>} Resolves with an object containing an array of tokens.
   */
  authenticate(token: string) {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject('No token provided');
      }

      fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((data: UserResponse) => {
          if (data.login) {
            // Wrap the token and user data in an array.
            const sessionData: SessionData = {
              tokens: [
                {
                  id: token,
                  user: trimUserData(data),
                },
              ],
            };
            resolve(sessionData);
          } else {
            reject('Invalid token');
          }
        })
        .catch(() => reject('Authentication failed'));
    });
  }

  /**
   * Restore the session from the stored data.
   * Here we check that the data contains a non-empty tokens array.
   *
   * @param {Object} data - The session data.
   * @returns {Promise<Object>} Resolves with the data if valid.
   */
  restore(sessionData: SessionData) {
    return new Promise((resolve, reject) => {
      // Check if session data exists and has a valid tokens array.
      if (
        sessionData &&
        Array.isArray(sessionData.tokens) &&
        sessionData.tokens.length > 0
      ) {
        resolve(sessionData);
      } else {
        reject('No valid session data found');
      }
    });
  }
}
