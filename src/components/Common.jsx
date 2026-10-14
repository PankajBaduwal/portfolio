import { useEffect, useRef } from 'react';
import { useInView } from '../lib/hooks.js';
import { Close } from './Icons.jsx';

export function Reveal({ as: Tag = 'div', className = '', delay = 0, style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal${inView ? ' is-in' : ''} ${className}`} style={{ ...style, '--rd': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

export function SectionHead({ index, label, title, italic, desc, id }) {
  return (
    <Reveal className="section-head">
      <p className="section-head__index" aria-hidden="true">
        <span>{index}</span>
        <span className="section-head__rule" />
        <span>{label}</span>
      </p>
      <h2 className="section-head__title" id={id}>
        {title} {italic && <em>{italic}</em>}
      </h2>
      {desc && <p className="section-head__desc">{desc}</p>}
    </Reveal>
  );
}

/** Accessible modal built on the native <dialog> element (focus trap + Esc for free). */
export function Dialog({ open, onClose, labelledBy, className = '', children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.classList.add('has-dialog');
    } else if (!open && d.open) {
      d.close();
    }
    if (!open) document.documentElement.classList.remove('has-dialog');
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="dialog__inner">
        <button type="button" className="dialog__close" onClick={onClose} aria-label="Close">
          <Close />
        </button>
        {open && children}
      </div>
    </dialog>
  );
}
