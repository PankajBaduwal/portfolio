import { Fragment, useEffect, useRef } from 'react';
import { useInView } from '../lib/hooks.js';
import { Close } from './Icons.jsx';

// variant: 'up' (default), 'left', 'right', 'scale', 'blur' or 'fade'; plays once, the first time it enters view.
export function Reveal({ as: Tag = 'div', className = '', delay = 0, variant = 'up', style, children, ...rest }) {
  const [ref, inView] = useInView();
  const v = variant === 'up' ? '' : ` reveal--${variant}`;
  return (
    <Tag ref={ref} className={`reveal${v}${inView ? ' is-in' : ''} ${className}`} style={{ ...style, '--rd': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

// Each word rises out of its own mask, in reading order.
function MaskedWords({ text, start = 0 }) {
  return text.split(' ').map((w, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span className="mask">
        <span className="mask__in" style={{ '--w': start + i }}>
          {w}
        </span>
      </span>
    </Fragment>
  ));
}

export function SectionHead({ index, label, title, italic, desc, id }) {
  const titleWords = title.split(' ').length;
  return (
    <Reveal className="section-head">
      <p className="section-head__index" aria-hidden="true">
        <span>{index}</span>
        <span className="section-head__rule" />
        <span>{label}</span>
      </p>
      <h2 className="section-head__title" id={id}>
        <MaskedWords text={title} />
        {italic && ' '}
        {italic && (
          <em>
            <MaskedWords text={italic} start={titleWords} />
          </em>
        )}
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
