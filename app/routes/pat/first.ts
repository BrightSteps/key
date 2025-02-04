import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';

export default class PatFirstRoute extends Route {
  @service('session') declare sessionService: SessionService;

  beforeModel() {
    this.sessionService.prohibitAuthentication('index');
  }
}
