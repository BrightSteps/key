import Base from 'ember-simple-auth/authenticators/base';
import { Promise } from 'rsvp';
import type { UserResponse } from 'key/types/github-rest';
import type { SessionData, TokenData } from 'key/types/auth';
import { trimUserData } from 'key/utils.ts/github-rest';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

export const Authenticator = 'authenticator:github-pat';
export type AuthenticatorType = typeof Authenticator;

export default class GithubPatAuthenticator extends Base {
  @service('router') declare routerService: RouterService;

  resoveSessionData = (
    resolve: (value?: unknown) => void,
    tokenData: TokenData[],
    isFirstToken: boolean = false
  ) => {
    const sessionData: SessionData = {
      tokens: tokenData,
    };
    resolve(sessionData);

    if (!isFirstToken) {
      // Refresh the app to reflect the new tokens.
      this.routerService.refresh();
    }
  };

  /**
   * Authenticates with GitHub using a single Personal Access Token (PAT).
   * If valid, it stores the token in an array to allow adding more tokens later.
   *
   * @param {String} token - The GitHub Personal Access Token.
   * @returns {Promise<Object>} Resolves with an object containing an array of tokens.
   */
  authenticate(token: string, existingTokenData: TokenData[] = []) {
    return new Promise((resolve, reject) => {
      const hasExistingTokenData = existingTokenData.length > 0;

      if (token) {
        const rejectWithReason = (reason: string) => {
          if (hasExistingTokenData) {
            this.resoveSessionData(resolve, existingTokenData);
          } else {
            reject(reason);
          }
        };

        // Validate the token by fetching the user data
        fetch('https://api.gaithub.com/user', {
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
              const tokens = [
                ...(hasExistingTokenData ? existingTokenData : []),
                {
                  id: token,
                  user: trimUserData(data),
                },
              ];
              this.resoveSessionData(resolve, tokens, !hasExistingTokenData);
            } else {
              rejectWithReason('Invalid token');
            }
          })
          .catch(() => {
            rejectWithReason('Authentication failed');
          });
      } else if (hasExistingTokenData) {
        // If there's existing token data, refresh the session with it.
        this.resoveSessionData(resolve, existingTokenData);
      } else {
        return reject('No token data provided');
      }
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
