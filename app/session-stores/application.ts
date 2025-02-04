import AdaptiveStore from 'ember-simple-auth/session-stores/adaptive';

export default class SessionStore extends AdaptiveStore {
  /* persist(data) {
    console.log('Persisting session data:', data);
    return super.persist(data);
  }

  restore() {
    return super.restore().then((data) => {
      console.log('Restored session data:', data);
      return data;
    });
  } */
}
