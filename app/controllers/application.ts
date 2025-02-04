import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';

import { getOwner } from '@ember/owner';
import Ember from 'ember';
import { action } from '@ember/object';

type Lookup = `${string}:${string}`;

export default class ApplicationController extends Controller {
  @service('session') declare sessionService: SessionService;

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    if (!Ember.testing) {
      const app = getOwner(this);

      window.debug = function (item: string) {
        let parsedItem: Lookup;
        if (item.indexOf(':') === -1) {
          // if type not specified, type is service
          parsedItem = 'service:' + item;
        } else {
          parsedItem = item as Lookup;
        }
        return app?.lookup(parsedItem as Lookup);
      };
    }
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  @action
  logout() {
    this.sessionService.invalidate();
  }
}
