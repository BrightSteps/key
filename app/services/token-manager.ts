// app/services/token-manager.js
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import type { UserResponse } from 'key/types/github-rest';
import { trimUserData } from 'key/utils.ts/github-rest';

export default class TokenManagerService extends Service {
  @service('session') declare sessionService: SessionService;

  /**
   * Invalidate (remove) a token from the session's tokens.
   * @param {String} tokenToRemove - The token value to remove.
   */
  invalidateToken(tokenToRemove: string) {
    const authenticatedData = this.sessionService.data.authenticated,
      tokens = authenticatedData.tokens || [],
      updatedTokens = tokens.filter(({ id }) => id !== tokenToRemove);

    // const updatedAuthenticatedData = {
    //   ...authenticatedData,
    //   tokens: updatedTokens,
    // }

    // this.sessionService.set('data', {
    //   authenticated: updatedAuthenticatedData,
    // });

    // this.sessionService.set('data.authenticated', updatedAuthenticatedData);

    this.sessionService.set('data.authenticated.tokens', updatedTokens); // TODO debug
  }

  /**
   * Reauthenticate a single token by calling GitHub's API.
   * If valid, updates the token's associated user data in the session.
   *
   * @param {String} tokenToReauthenticate - The token to revalidate.
   * @returns {Promise<Object>} - Resolves with the updated token object, or rejects on error.
   */
  async reauthenticateToken(tokenToReauthenticate: string) {
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${tokenToReauthenticate}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to reauthenticate token: ${response.statusText}`);
    }

    const data = (await response.json()) as UserResponse;
    if (!data.login) {
      throw new Error('Reauthentication failed: Invalid token data.');
    }
    const userData = trimUserData(data);

    const tokens = this.sessionService.data.authenticated.tokens || [];
    const updatedTokens = tokens.map((tokenObj) => {
      if (tokenObj.token === tokenToReauthenticate) {
        return { id: tokenToReauthenticate, user: userData };
      }
      return tokenObj;
    });

    this.sessionService.set('data.authenticated.tokens', updatedTokens);
    return { id: tokenToReauthenticate, user: userData };
  }

  /**
   * Add a new token to the session's tokens array.
   * Validates the token and, if valid, appends it.
   *
   * @param {String} newToken - The new token to add.
   * @returns {Promise<Object>} - Resolves with the token object if successful.
   */
  async addToken(newToken: string) {
    if (!newToken) {
      throw new Error('No token provided');
    }

    // First, validate the new token with GitHub's API.
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${newToken}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to validate token: ${response.statusText}`);
    }

    const userData = (await response.json()) as UserResponse;
    if (!userData.login) {
      throw new Error('Invalid token');
    }

    // Retrieve existing tokens and check for duplicates.
    const tokens = this.sessionService.data.authenticated.tokens || [];
    if (tokens.find((tokenObj) => tokenObj.token === newToken)) {
      throw new Error('Token already exists in your session');
    }

    // Append the new token.
    tokens.push({ id: newToken, user: userData });
    this.sessionService.set('data.authenticated.tokens', tokens);

    return { id: newToken, user: userData };
  }
}
