import {FunctionalComponent, h} from '@stencil/core';
import {filterProtocol} from '../../../utils/xss-utils';

export interface ResultLinkEventProps {
  onSelect: () => void;
  onBeginDelayedSelect: () => void;
  onCancelPendingSelect: () => void;
  stopPropagation?: boolean;
}

export interface ResultLinkProps extends ResultLinkEventProps {
  href: string;
  className?: string;
  part?: string;
  title?: string;
  ref?: (elm?: HTMLAnchorElement) => void;
  stopPropagation?: boolean;
  attributes?: Attr[];
  tabIndex?: number;
  ariaHidden?: boolean;
}

export const bindAnalyticsToLink = (
  link: HTMLAnchorElement,
  {
    onSelect,
    onBeginDelayedSelect,
    onCancelPendingSelect,
    stopPropagation = true,
  }: ResultLinkEventProps
) => {
  const stopPropagationAndProcess = (e: Event, process: () => void) => {
    stopPropagation && e.stopPropagation();
    process();
  };
  (['click', 'contextmenu', 'mousedown', 'mouseup'] as const).forEach(
    (eventName) =>
      link.addEventListener(eventName, (e) =>
        stopPropagationAndProcess(e, onSelect)
      )
  );
  link.addEventListener(
    'touchstart',
    (e) => stopPropagationAndProcess(e, onBeginDelayedSelect),
    {passive: true}
  );
  link.addEventListener(
    'touchend',
    (e) => stopPropagationAndProcess(e, onCancelPendingSelect),
    {passive: true}
  );
};

export const LinkWithResultAnalytics: FunctionalComponent<ResultLinkProps> = (
  {
    href,
    className,
    part,
    title,
    onSelect,
    onBeginDelayedSelect,
    onCancelPendingSelect,
    ref,
    attributes,
    tabIndex,
    ariaHidden,
    stopPropagation = true,
  },
  children
) => {
  return (
    <a
      class={className}
      part={part}
      href={filterProtocol(href)}
      title={title}
      ref={(el) => {
        if (ref) {
          ref(el);
        }

        if (!el) {
          return;
        }

        bindAnalyticsToLink(el, {
          onSelect,
          onBeginDelayedSelect,
          onCancelPendingSelect,
          stopPropagation,
        });

        if (attributes?.length) {
          [...attributes].forEach(({nodeName, nodeValue}) => {
            el.setAttribute(nodeName, nodeValue!);
          });
        }

        if (ariaHidden) {
          el.setAttribute('aria-hidden', 'true');
        }
      }}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
};
