// app/controllers/login.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type SessionService from 'key/services/session';
import { Authenticator } from 'key/authenticators/github-pat';

export default class LoginController extends Controller {
  @service('session') declare sessionService: SessionService;

  @tracked token = '';

  @action
  updateToken(event: Event) {
    const target = event.target as HTMLInputElement;
    this.token = target?.value ?? '';
  }

  @action
  async login(event: Event) {
    event.preventDefault();
    try {
      await this.sessionService.authenticate(Authenticator, this.token);
      // TODO transition to a protected route.
    } catch (error) {
      // TODO handle error
      alert(error);
    }
  }
}
