'use client';

import { useEffect } from 'react';

/**
 * Dev-only "point at the site" helper for the PTA Studio kiosk.
 *
 * When PTA Studio (the parent frame) turns on pick mode, hovering highlights
 * elements and clicking sends a plain description of the clicked element back to
 * PTA Studio, so the chat assistant knows exactly what the user is pointing at.
 *
 * It renders nothing, does nothing in production, and does nothing unless the page
 * is embedded in another frame (PTA Studio). It never ships to the live site.
 */
export default function VisualPicker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    if (typeof window === 'undefined' || window.parent === window) return; // only inside PTA Studio

    let active = false;
    let hoverEl: HTMLElement | null = null;

    const box = document.createElement('div');
    box.style.cssText =
      'position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #2f8f5b;' +
      'background:rgba(47,143,91,.12);border-radius:4px;display:none;';
    const label = document.createElement('div');
    label.style.cssText =
      'position:fixed;z-index:2147483647;pointer-events:none;background:#2f8f5b;color:#fff;' +
      'font:600 12px system-ui;padding:3px 8px;border-radius:6px;display:none;white-space:nowrap;';
    const banner = document.createElement('div');
    banner.textContent = '👆 Click the part of the website you want to change';
    banner.style.cssText =
      'position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:2147483647;' +
      'pointer-events:none;background:#24303a;color:#fff;font:600 14px system-ui;padding:8px 16px;' +
      'border-radius:999px;display:none;box-shadow:0 4px 16px rgba(0,0,0,.25);';
    document.body.append(box, label, banner);

    const roleOf = (el: HTMLElement): string => {
      const t = el.tagName.toLowerCase();
      if (/^h[1-6]$/.test(t)) return 'heading';
      if (t === 'a') return 'link';
      if (t === 'button') return 'button';
      if (t === 'img') return 'image';
      if (t === 'input' || t === 'textarea' || t === 'select') return 'form field';
      if (t === 'nav') return 'navigation';
      if (t === 'li') return 'list item';
      if (t === 'p' || t === 'span') return 'text';
      if (['section', 'header', 'footer', 'main', 'article'].includes(t)) return t;
      return t;
    };
    const textOf = (el: HTMLElement) =>
      (el.innerText || (el as HTMLImageElement).alt || '').replace(/\s+/g, ' ').trim().slice(0, 100);
    const landmarkOf = (el: HTMLElement): string => {
      let n: HTMLElement | null = el;
      while (n && n !== document.body) {
        const t = n.tagName.toLowerCase();
        if (t === 'header') return 'the header';
        if (t === 'footer') return 'the footer';
        if (t === 'nav') return 'the navigation menu';
        if (['section', 'main', 'article'].includes(t)) {
          const h = n.querySelector('h1,h2,h3') as HTMLElement | null;
          if (h && h.innerText.trim()) return `the "${h.innerText.trim().slice(0, 40)}" section`;
        }
        n = n.parentElement;
      }
      return 'the page';
    };
    const selectorOf = (el: HTMLElement): string => {
      const parts: string[] = [];
      let n: HTMLElement | null = el;
      for (let i = 0; n && n !== document.body && i < 3; i++) {
        let s = n.tagName.toLowerCase();
        if (n.id) { parts.unshift(s + '#' + n.id); break; }
        parts.unshift(s);
        n = n.parentElement;
      }
      return parts.join(' > ');
    };

    const setActive = (on: boolean) => {
      active = on;
      banner.style.display = on ? 'block' : 'none';
      document.body.style.cursor = on ? 'crosshair' : '';
      if (!on) { box.style.display = 'none'; label.style.display = 'none'; }
    };

    const onMove = (e: MouseEvent) => {
      if (!active) return;
      const el = e.target as HTMLElement;
      if (!el || el === document.body) return;
      hoverEl = el;
      const r = el.getBoundingClientRect();
      box.style.display = 'block';
      box.style.left = r.left + 'px'; box.style.top = r.top + 'px';
      box.style.width = r.width + 'px'; box.style.height = r.height + 'px';
      const txt = textOf(el);
      label.textContent = roleOf(el) + (txt ? `: "${txt.slice(0, 30)}"` : '');
      label.style.display = 'block';
      label.style.left = r.left + 'px';
      label.style.top = Math.max(2, r.top - 24) + 'px';
    };
    const onClick = (e: MouseEvent) => {
      if (!active) return;
      e.preventDefault(); e.stopPropagation();
      const el = (e.target as HTMLElement) || hoverEl;
      if (!el) return;
      window.parent.postMessage({
        type: 'pta-studio:picked',
        info: {
          route: location.pathname,
          role: roleOf(el),
          text: textOf(el),
          landmark: landmarkOf(el),
          selector: selectorOf(el),
          html: (el.outerHTML || '').replace(/\s+/g, ' ').slice(0, 240),
        },
      }, '*');
      setActive(false);
    };
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (d && typeof d === 'object' && d.type === 'pta-studio:pick-mode') setActive(!!d.on);
    };

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: 'pta-studio:picker-ready' }, '*');

    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMsg);
      box.remove(); label.remove(); banner.remove();
      document.body.style.cursor = '';
    };
  }, []);

  return null;
}
