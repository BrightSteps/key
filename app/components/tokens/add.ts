import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type SessionService from 'key/services/session';
import { Authenticator } from 'key/authenticators/github-pat';
import type TokenManagerService from 'key/services/token-manager';

interface Args {
  heading: string;
  info: string;
  maxInputWidth?: string;
}

export default class TokensAddComponent extends Component<Args> {
  @service('session') declare sessionService: SessionService;
  @service('token-manager') declare tokenManagerService: TokenManagerService;

  @tracked token = '';

  get maxInputWidth() {
    return this.args.maxInputWidth ?? '';
  }

  @action
  handleTokenChange(value: string) {
    this.token = value;
  }

  @action
  async addToken(event: Event) {
    event.preventDefault();
    try {
      if (this.sessionService.tokens.length) {
        this.tokenManagerService.addToken(this.token).catch(() => {});
      } else {
        await this.sessionService.authenticate(Authenticator, this.token);
      }
      // TODO clear inout value
    } catch (error) {
      // TODO handle error
      alert(error);
    }
  }
}
