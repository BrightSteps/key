import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { RouteName } from '../nav';

export default class ReposListComponent extends Component {
  @service('session') declare sessionService: SessionService;

  repos = ['test'];
  addTokenRouteName = RouteName.ADD_TOKEN;

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }
}
