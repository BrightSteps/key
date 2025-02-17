import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { LanguageOption } from 'key/components/repos/explorer';

import type { Repo } from 'key/models/custom/repo';

export const enum Privacy {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
  ALL = 'All',
}

interface Args {
  allRepos: Repo[];
}

interface ReposListFilterComponentInterface<T> {
  Args: T;
  Blocks: { default: [Repo[]] }; // this is needed for yield
}

export default class ReposListFilterComponent extends Component<
  ReposListFilterComponentInterface<Args>
> {
  classForPrivateFilter =
    'px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-sky-100';
  filter: FilterModel;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.filter = new FilterModel();
  }

  get privacyOptions() {
    return [Privacy.ALL, Privacy.PUBLIC, Privacy.PRIVATE].map((o) => ({
      value: o,
      activeClass: o === this.filter.privacy ? '!bg-sky-200' : '',
    }));
  }

  get languageOptions(): LanguageOption[] {
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

  get showLanguageOptions() {
    return this.languageOptions.length > 1;
  }

  get isRepoDataIncomplete() {
    return this.args.allRepos.some(
      (repo) => repo.languages === undefined || repo.branches === undefined
    );
  }

  get visibleRepos() {
    let filtered = this.args.allRepos.filter((repo) => {
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

  @action
  changePrivacyFilter(value: Privacy) {
    this.filter.privacy = value;
  }

  @action
  changeLanguageFilter(value: string) {
    this.filter.language = value;
  }
}

export class FilterModel {
  @tracked language: string;
  @tracked privacy: Privacy;

  constructor() {
    this.privacy = Privacy.ALL;
    this.language = 'All';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::List::Filter': typeof ReposListFilterComponent;
  }
}
