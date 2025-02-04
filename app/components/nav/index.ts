import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export const enum RouteName {
  INDEX = 'index',
  TOKENS = 'pat.authenticated.tokens',
  ADD_TOKEN = 'pat.first',
}

const routeDetails = {
  [RouteName.INDEX]: { name: 'Home' },
  [RouteName.TOKENS]: { name: 'Tokens', requiresAuth: true },
};

interface NavigationLink {
  name: string;
  route: string;
  requiresAuth?: boolean;
}

const navigationLinks: NavigationLink[] = Object.entries(routeDetails).map(
  ([route, details]) => {
    const { name, requiresAuth = false } =
      'requiresAuth' in details
        ? details
        : { ...{ requiresAuth: false }, ...details };

    return {
      name,
      route,
      requiresAuth,
    };
  }
);

export default class NavIndexComponent extends Component {
  @service('session') declare sessionService: SessionService;
  @service('router') declare routerService: RouterService;

  get navigationLinks() {
    return navigationLinks
      .filter((route) => (route.requiresAuth ? this.isAuthenticated : true))
      .map((l) => {
        const isActive = this.routerService.isActive(l.route);
        return {
          ...l,
          isActive,
          classes: isActive
            ? 'bg-indigo-700 text-white'
            : 'text-gray-900 hover:bg-indigo-500 hover:text-white',
        };
      });
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  get isRouteAddToken() {
    return this.routerService.currentRouteName === RouteName.ADD_TOKEN;
  }

  get revokeTokensText() {
    return this.sessionService.tokens.length > 1
      ? 'Revoke all tokens'
      : 'Revoke token';
  }

  @action
  revokeTokens() {
    this.sessionService.invalidate();
  }

  @action
  addToken() {
    this.routerService.transitionTo(RouteName.ADD_TOKEN);
  }
}
