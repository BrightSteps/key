import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type UiHelperService from 'key/services/ui-helper';

export default class ReposListComponent extends Component {
  @service('session') declare sessionService: SessionService;
  @service('ui-helper') declare uiHelperService: UiHelperService;

  @tracked organizationName = '';

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;

    this.search();
  }

  repos = ['test'];

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  @action
  search() {
    console.log('searching', this.organizationName);
  }
}
