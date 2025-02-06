import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';

export default class TokensIndexComponent extends Component {
  @service('session') declare sessionService: SessionService;
  isInvalidating: boolean = false;

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  async invalidateToken(tokenToRemove: string) {
    this.isInvalidating = true;
    try {
      await this.sessionService.invalidateToken(tokenToRemove);
    } finally {
      this.isInvalidating = false;
    }
  }
}
