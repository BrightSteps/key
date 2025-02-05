import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';
import type TokenManagerService from 'key/services/token-manager';

export default class TokensIndexComponent extends Component {
  @service('session') declare sessionService: SessionService;
  @service('token-manager') declare tokenManagerService: TokenManagerService;

  actionsClasses =
    'px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700';

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  reauthenticateToken(tokenToReauthenticate: string) {
    this.tokenManagerService
      .reauthenticateToken(tokenToReauthenticate)
      .catch(() => {})
      .finally(() => {});
  }

  @action
  invalidateToken(tokenToRemove: string) {
    this.tokenManagerService.invalidateToken(tokenToRemove);
  }

  @action
  addToken(tokenToAdd: string) {
    this.tokenManagerService.addToken(tokenToAdd).catch(() => {});
  }
}
