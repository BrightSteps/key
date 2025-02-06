import Component from '@glimmer/component';
import type { Languages } from 'key/types/github';

interface LanguageUsageArgs {
  languages: Languages;
}

interface LanguageUsageObj {
  language: string;
  percentage: number;
}

export default class ReposListLanguageUsage extends Component<LanguageUsageArgs> {
  languagePercentages: LanguageUsageObj[] = [];

  constructor(owner: unknown, args: LanguageUsageArgs) {
    super(owner, args);
    this.calculatePercentages();
  }

  calculatePercentages() {
    const { languages } = this.args || {};

    if (!languages) {
      return [];
    }

    const total = Object.values(languages).reduce(
      (sum, value) => sum + value,
      0
    );

    this.languagePercentages = Object.entries(languages).map(
      ([language, value]) => ({
        language,
        percentage: parseFloat(((value / total) * 100).toFixed(2)),
      })
    );
  }
}
