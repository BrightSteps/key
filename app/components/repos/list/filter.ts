import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export const enum Privacy {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
  ALL = 'All',
}

interface Args {
  model: FilterModel;
  languageOptions: string[];
}

export default class ReposListFilterComponent extends Component<Args> {
  classForPrivateFilter =
    'px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-sky-100';

  get privacyOptions() {
    return [Privacy.ALL, Privacy.PUBLIC, Privacy.PRIVATE].map((o) => ({
      value: o,
      activeClass: o === this.args.model.privacy ? '!bg-sky-200' : '',
    }));
  }

  get showLanguageOptions() {
    return this.args.languageOptions.length > 1;
  }

  @action
  changePrivacyFilter(value: Privacy) {
    this.args.model.privacy = value;
  }

  @action
  changeLanguageFilter(value: Privacy) {
    this.args.model.language = value;
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
