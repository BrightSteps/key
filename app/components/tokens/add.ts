import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type SessionService from 'key/services/session';
import { Authenticator } from 'key/authenticators/github-pat';
import { RouteName } from '../nav';

interface Args {
  heading: string;
  info: string;
  maxInputWidth?: string;
  showCtaInstead?: boolean;
}

export default class TokensAddComponent extends Component<Args> {
  @service('session') declare sessionService: SessionService;
  linkTo: string;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.linkTo = RouteName.ADD_TOKEN;
  }

  @tracked token = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  get maxInputWidth() {
    return this.args.maxInputWidth ?? '';
  }

  @action
  handleTokenChange(value: string) {
    this.token = value;
  }

  @action
  addToken(event: Event) {
    event.preventDefault();
    this.isLoading = true;

    const handleSuccess = () => {
      this.token = '';
      this.isLoading = false;
      (document.getElementById('token') as HTMLInputElement).value = ''; // Clear the input value
    };

    const handleError = (error: string) => {
      this.errorMessage = error || 'Failed to add token. Please try again.';
      this.isLoading = false;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    };

    const request = this.sessionService.tokens.length
      ? this.sessionService.addToken(this.token, handleError)
      : this.sessionService.authenticate(
          Authenticator,
          this.token,
          [],
          handleError
        );

    request
      .then(handleSuccess)
      .catch(() => handleError('Failed to add token. Please try again.'));
  }
}
