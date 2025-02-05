import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type CustomSessionService from 'key/services/session';

interface Args {
  onOrganizationNameChange: (value: string) => void;
  onTokenChange: (value: string) => void;
}

export default class ReposSearchComponent extends Component<Args> {
  @service('session') declare sessionService: CustomSessionService;

  @tracked organizationName = '';

  token = '';

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  isSelectedToken(tokenId: string) {
    return tokenId === this.token;
  }

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;
    this.args.onOrganizationNameChange(this.organizationName);
  }

  @action
  handleTokenChange(event: Event) {
    const target = event.target as HTMLInputElement,
      value = target?.value ?? '';

    this.token = value; // TODOOOOOO

    this.args.onTokenChange(this.token);
  }
}
