import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ReposListItemComponent extends Component {
  @tracked isExpanded = false;

  get activeClass() {
    return this.isExpanded ? 'bg-gray-100' : '';
  }

  @action
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
