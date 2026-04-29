import { Fragment, type ReactNode } from 'react';

const LINK_PATTERN = /(https?:\/\/[^\s<]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const TRAILING_PUNCT = /[.,;:!?)"'\]]+$/;

export function linkify(text: string | null | undefined): ReactNode {
  if (!text) return null;

  const parts = text.split(LINK_PATTERN);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;

    const trailing = part.match(TRAILING_PUNCT);
    const linkText = trailing ? part.slice(0, -trailing[0].length) : part;
    const tail = trailing ? trailing[0] : '';
    const isEmail = !/^https?:\/\//.test(linkText);
    const href = isEmail ? `mailto:${linkText}` : linkText;

    return (
      <Fragment key={i}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          {linkText}
        </a>
        {tail}
      </Fragment>
    );
  });
}
