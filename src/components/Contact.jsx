import { useRef, useState } from 'react';
import { profile, site, socials } from '../data/portfolio.js';
import { Reveal, SectionHead } from './Common.jsx';
import { ArrowUpRight, Mail, Phone, Pin, socialIcon } from './Icons.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please tell me your name.';
  if (!v.email.trim()) e.email = 'Please add your email so I can reply.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email address doesn’t look right.';
  if (!v.subject.trim()) e.subject = 'Please add a short subject.';
  if (v.message.trim().length < 10) e.message = 'Please write a message of at least 10 characters.';
  return e;
}

const mode = site.web3formsKey ? 'web3forms' : site.contactEndpoint ? 'endpoint' : 'mailto';

async function send(values) {
  if (mode === 'web3forms') {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: site.web3formsKey, ...values, from_name: 'Portfolio contact form' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || 'The message could not be sent.');
    return;
  }
  const res = await fetch(site.contactEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error('The message could not be sent.');
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '', company: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const formRef = useRef(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.company) return; // honeypot
    const errs = validate(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      setStatus({ state: 'error', msg: 'Please fix the highlighted fields.' });
      return;
    }
    const payload = { name: values.name.trim(), email: values.email.trim(), subject: values.subject.trim(), message: values.message.trim() };
    if (mode === 'mailto') {
      const body = `${payload.message}\n\n— ${payload.name} (${payload.email})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
      setStatus({
        state: 'info',
        msg: `Your email app should open with this message ready to send. If nothing opened, write to ${profile.email}.`,
      });
      return;
    }
    setStatus({ state: 'sending', msg: 'Sending…' });
    try {
      await send(payload);
      setStatus({ state: 'success', msg: 'Thanks — your message was sent. I’ll reply by email.' });
      setValues({ name: '', email: '', subject: '', message: '', company: '' });
    } catch (err) {
      setStatus({ state: 'error', msg: `${err.message} Please try again, or email me directly at ${profile.email}.` });
    }
  };

  const field = (name, label, props = {}) => {
    const Tag = props.as || 'input';
    const { as, ...rest } = props;
    return (
      <div className={`field${errors[name] ? ' has-error' : ''}`}>
        <label htmlFor={`cf-${name}`}>{label}</label>
        <Tag
          id={`cf-${name}`}
          name={name}
          value={values[name]}
          onChange={onChange}
          aria-invalid={errors[name] ? 'true' : undefined}
          aria-describedby={errors[name] ? `cf-${name}-err` : undefined}
          required
          {...rest}
        />
        {errors[name] && (
          <p className="field__error" id={`cf-${name}-err`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHead index="09" label="Contact" title="Let’s" italic="work together" desc="Have a project in mind? I’d love to hear about it. Send me a message and let’s talk." id="contact-title" />
        <Reveal className="terminal" variant="scale">
          <div className="terminal__info">
            <p className="terminal__label">Holder information</p>
            <ul className="terminal__rows">
              <li>
                <Mail />
                <span className="terminal__k">Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <Phone />
                <span className="terminal__k">Phone / WhatsApp</span>
                <span className="terminal__multi">
                  <a href={profile.phoneHref}>{profile.phone}</a>
                  <a href={profile.whatsappHref} target="_blank" rel="noopener noreferrer" className="terminal__sub">
                    WhatsApp <ArrowUpRight width={13} height={13} />
                  </a>
                </span>
              </li>
              {socials.slice(0, 2).map((s) => {
                const Icon = socialIcon[s.label];
                return (
                  <li key={s.label}>
                    <Icon />
                    <span className="terminal__k">{s.label}</span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.handle}
                    </a>
                  </li>
                );
              })}
              <li>
                <Pin />
                <span className="terminal__k">Location</span>
                <span>{profile.location}</span>
              </li>
            </ul>
            <p className="terminal__note">I usually respond within 24 hours.</p>
          </div>

          <form className="terminal__form" ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="cf-status">
            {field('name', 'Your name', { autoComplete: 'name', placeholder: 'Your full name' })}
            {field('email', 'Email address', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
            {field('subject', 'Subject', { placeholder: 'Project inquiry' })}
            {field('message', 'Message', { as: 'textarea', rows: 5, placeholder: 'Tell me about your project…' })}
            <div className="hp" aria-hidden="true">
              <label htmlFor="cf-company">Company</label>
              <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={onChange} />
            </div>
            <div className="terminal__submit">
              <button type="submit" className="btn btn--primary btn--press" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : mode === 'mailto' ? 'Compose email' : 'Send message'}
              </button>
              <a className="btn btn--link" href={`mailto:${profile.email}`}>
                Or email directly
              </a>
            </div>
            <p id="cf-status" className={`form-status form-status--${status.state}`} role={status.state === 'error' ? 'alert' : 'status'} aria-live="polite">
              {status.msg}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
