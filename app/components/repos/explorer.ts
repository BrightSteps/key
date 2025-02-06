import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type SessionService from 'key/services/session';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type UiHelperService from 'key/services/ui-helper';
import type GithubService from 'key/services/github';
import type { TokenData } from 'key/types/auth';
import { debounce } from '@ember/runloop';
import { FilterModel, Privacy } from './list/filter';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Args {}

export default class ReposExplorerComponent extends Component<Args> {
  @service('session') declare sessionService: SessionService;
  @service('ui-helper') declare uiHelperService: UiHelperService;
  @service('github') declare githubService: GithubService;

  @tracked organizationName = '';
  @tracked token: TokenData | null;
  @tracked isLoading = false;
  @tracked errorMessage: string | null = null;
  filter: FilterModel;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.token = this.sessionService.tokens[0] || null;
    this.filter = new FilterModel();
  }

  get tokenUserLogin() {
    return this.token?.user.login ?? '';
  }

  @action
  handleTokenChange(value: string) {
    this.token =
      this.sessionService.tokens.find((tokenData) => {
        return tokenData.id === value;
      }) ?? null;

    this.search();
  }

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;
    this.isLoading = true;
    this.errorMessage = null;
    this.debouncedSearch();
  }

  debouncedSearch() {
    // eslint-disable-next-line ember/no-runloop, @typescript-eslint/unbound-method
    debounce(this, this.search, 1000);
  }

  get allRepos() {
    const results = this.githubService.repos.filter((repo) => {
      return (
        repo.requestedBy.has(this.tokenUserLogin) &&
        repo.organizationName === this.organizationName
      );
    });
    return results;
  }

  get visibleRepos() {
    let filtered = this.allRepos.filter((repo) => {
      if (this.filter.privacy === Privacy.PUBLIC) {
        return !repo.isPrivate;
      } else if (this.filter.privacy === Privacy.PRIVATE) {
        return repo.isPrivate;
      }

      return true;
    });

    filtered = filtered.filter((repo) =>
      this.filter.language === 'All'
        ? true
        : repo.languagesArray?.some((l) => l === this.filter.language)
    );

    return filtered;
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  get isRepoDataIncomplete() {
    return this.allRepos.some(
      (repo) => repo.languages === undefined || repo.branches === undefined
    );
  }

  get languageOptions() {
    let allLanguages = this.visibleRepos.flatMap((repo) =>
      repo.languages ? Object.keys(repo.languages) : []
    );

    const languageSet = new Set(allLanguages);

    allLanguages =
      this.filter.language === 'All' || languageSet.has(this.filter.language)
        ? [...languageSet]
        : [this.filter.language, ...languageSet];

    return ['All', ...allLanguages].map((language) => ({
      value: language,
      activeClass: language === this.filter.language ? '!bg-sky-200' : '',
    }));
  }

  @action
  search() {
    if (this.isAuthenticated && this.organizationName) {
      this.isLoading = true;
      this.errorMessage = null;
      this.githubService
        .fetchRepos(this.token, this.organizationName)
        .catch(() => {
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
