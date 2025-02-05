import SimpleAuthSessionService from 'ember-simple-auth/services/session';
import { Authenticator } from 'key/authenticators/github-pat';
import type { AuthenticatorType } from 'key/authenticators/github-pat';
import type { TokenData } from 'key/types/auth';

type Data = {
  authenticated: {
    authenticator: AuthenticatorType;
    tokens: TokenData[];
  };
};

export default class CustomSessionService extends SimpleAuthSessionService<Data> {
  authenticator = Authenticator;

  get tokens() {
    return this.data.authenticated.tokens || [];
  }

  updateTokens(tokens: TokenData[]) {
    const promise = new Promise((resolve) => {
      if (tokens.length) {
        resolve(this.authenticate(this.authenticator, '', tokens));
      } else {
        this.invalidate();
        resolve('ok');
      }
    });

    return promise;
  }
}
