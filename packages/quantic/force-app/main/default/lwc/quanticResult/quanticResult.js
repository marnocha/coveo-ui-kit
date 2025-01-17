// @ts-ignore
import defaultTemplate from './quanticResult.html';

import {LightningElement, api, track} from 'lwc';
import {TimeSpan} from 'c/quanticUtils';

/** @typedef {import("coveo").Result} Result */
/** @typedef {import("coveo").ResultTemplatesManager} ResultTemplatesManager */

/**
 * The `QuanticResult` component is used internally by the `QuanticResultList` component.
 * @category Search
 * @category Insight Panel
 * @example
 * <c-quantic-result engine-id={engineId} result={result} result-templates-manager={resultTemplatesManager}></c-quantic-result>
 */
export default class QuanticResult extends LightningElement {
  /**
   * The ID of the engine instance the component registers to.
   * @api
   * @type {string}
   */
  @api engineId;
  /**
   * The [result item](https://docs.coveo.com/en/headless/latest/reference/search/controllers/result-list/#result).
   * @api
   * @type {Result}
   */
  @api result;
  /**
   * The template manager from which to get registered custom templates.
   * @api
   * @type {ResultTemplatesManager}
   */
  @api resultTemplatesManager;
  /**
   * @type {string}
   */
  @api openPreviewId;

  @track resultHasPreview = true;

  /** @type {boolean} */
  isHovered = false;
  /** @type {boolean} */
  quickviewIsOpen = false;

  connectedCallback() {
    this.template.addEventListener('haspreview', this.onHasPreview);
    this.template.host.addEventListener('mouseenter', this.setHoverState);
    this.template.host.addEventListener('mouseleave', this.removeHoverState);
    this.template.addEventListener('quantic__resultpreviewtoggle', this.handlePreviewToggle);
  }

  disconnectedCallback() {
    this.template.removeEventListener('haspreview', this.onHasPreview);
    this.template.host.removeEventListener('mouseenter', this.setHoverState);
    this.template.host.removeEventListener('mouseleave', this.removeHoverState);
    this.template.removeEventListener('quantic__resultpreviewtoggle', this.handlePreviewToggle);
  }

  get videoThumbnail() {
    return `http://img.youtube.com/vi/${this.result.raw.ytvideoid}/mqdefault.jpg`;
  }

  get videoSourceId() {
    return `https://www.youtube.com/embed/${this.result.raw.ytvideoid}?autoplay=0`;
  }

  get videoTimeSpan() {
    return new TimeSpan(
      this.result.raw.ytvideoduration,
      false
    ).getCleanHHMMSS();
  }

  onHasPreview = (evt) => {
    this.resultHasPreview = evt.detail.hasPreview;
    evt.stopPropagation();
  };

  render() {
    const template = this.resultTemplatesManager.selectTemplate(this.result);
    if (template) {
      return template;
    }
    return defaultTemplate;
  }

  get resultPreviewShouldNotBeAccessible() {
    return !!this.openPreviewId && this.result.uniqueId !== this.openPreviewId;
  }

  get isAnyPreviewOpen() {
    return !!this.openPreviewId;
  }

  setHoverState = () => {
    this.isHovered = true;
  };

  removeHoverState = () => {
    if (!this.quickviewIsOpen) {
      this.isHovered = false;
    }
  };

  handlePreviewToggle = (event) => {
    this.quickviewIsOpen = event.detail.isOpen;
    this.removeHoverState();
  };
}
