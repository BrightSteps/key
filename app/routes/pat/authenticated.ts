import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import type Transition from '@ember/routing/transition';
import { RouteName } from 'key/components/nav';

export default class PatAuthenticatedRoute extends Route {
  @service('session') declare sessionService: SessionService;

  beforeModel(transition: Transition) {
    this.sessionService.requireAuthentication(transition, RouteName.ADD_TOKEN);
  }
}
