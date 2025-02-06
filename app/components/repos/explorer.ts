import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type UiHelperService from 'key/services/ui-helper';
import type GithubService from 'key/services/github';
import type { TokenData } from 'key/types/auth';
import { debounce } from '@ember/runloop';

interface Args {}

export default class ReposExplorerComponent extends Component<Args> {
  @service('session') declare sessionService: SessionService;
  @service('ui-helper') declare uiHelperService: UiHelperService;
  @service('github') declare githubService: GithubService;

  @tracked organizationName = '';
  @tracked token: TokenData | null;
  @tracked isLoading = false;
  @tracked errorMessage: string | null = null;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.token = this.sessionService.tokens[0] || null;
  }

  get tokenUserLogin() {
    return this.token?.user.login ?? '';
  }

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;
    this.isLoading = true;
    this.errorMessage = null;
    this.debouncedSearch();
  }

  debouncedSearch() {
    debounce(this, this.search, 1000);
  }

  get visibleRepos() {
    return this.githubService.repos.filter((repo) => {
      return (
        repo.requestedBy.has(this.tokenUserLogin) &&
        repo.organizationName === this.organizationName
      );
    });
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  @action
  search() {
    if (this.isAuthenticated && this.organizationName) {
      this.isLoading = true;
      this.errorMessage = null;
      this.githubService
        .fetchRepos(this.token, this.organizationName)
        .catch((e) => {
          this.errorMessage = 'Failed to fetch repositories. Please try again.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }
}
