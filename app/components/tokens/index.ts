import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';
import type TokenManagerService from 'key/services/token-manager';

export default class TokensIndexComponent extends Component {
  @service('session') declare sessionService: SessionService;
  @service('token-manager') declare tokenManagerService: TokenManagerService;

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  reauthenticateToken(tokenToReauthenticate: string) {
    this.tokenManagerService
      .reauthenticateToken(tokenToReauthenticate)
      .catch((error) => {})
      .finally(() => {});
  }

  @action
  invalidateToken(tokenToRemove: string) {
    this.tokenManagerService.invalidateToken(tokenToRemove);
  }

  @action
  addToken(tokenToAdd: string) {
    this.tokenManagerService.addToken(tokenToAdd).catch((error) => {});
  }
}
