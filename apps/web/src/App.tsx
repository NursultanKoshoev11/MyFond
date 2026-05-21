import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Code2, Layers3, Send, Sparkles, Workflow } from "lucide-react";
import type { SiteContent } from "@myfond/shared";
import { siteContent as fallbackContent } from "@myfond/shared";
import { loadSiteContent, sendContactRequest } from "./api";

const icons = [Code2, Layers3, Workflow, Bot];

export default function App() {
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const movingWorkItems = [...content.work, ...content.work, ...content.work];

  useEffect(() => {
    loadSiteContent().then(setContent).catch(() => setContent(fallbackContent));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await sendContactRequest({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        message: String(form.get("message") || ""),
        channel: "site"
      });

      setStatus(response.message);
      event.currentTarget.reset();
    } catch {
      setStatus("Не получилось отправить заявку. Проверьте сервер и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top">
          <span>M</span>
          <div>
            <strong>{content.brand.name}</strong>
            <small>{content.brand.tagline}</small>
          </div>
        </a>
        <nav>
          <a href="#services">Услуги</a>
          <a href="#work">Работы</a>
          <a href="#process">Процесс</a>
          <a href="#contact">Контакт</a>
        </nav>
      </header>

      <section id="top" className="hero">
        <div className="glow glowA" />
        <div className="glow glowB" />

        <motion.div
          className="heroText"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow"><Sparkles size={18} /> {content.hero.eyebrow}</p>
          <h1>{content.hero.title}</h1>
          <p className="lead">{content.hero.subtitle}</p>
          <div className="actions">
            <a className="btn primary" href="#contact">{content.hero.primaryCta}<ArrowRight size={18} /></a>
            <a className="btn ghost" href="#work">{content.hero.secondaryCta}</a>
          </div>
        </motion.div>

        <motion.div
          className="heroPanel"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="panelTop"><span /> <span /> <span /></div>
          <div className="orbit one" />
          <div className="orbit two" />
          <div className="gridCards">
            <div className="dashCard large">
              <Code2 />
              <strong>Web + API</strong>
              <p>Единая архитектура для сайта, backend и будущего Telegram-бота.</p>
            </div>
            <div className="dashCard pulse"><Workflow /><strong>Automation</strong></div>
            <div className="dashCard"><Bot /><strong>Bot-ready</strong></div>
          </div>
          <pre>{`GET /api/site\nPOST /api/contact\nFuture: Telegram bot`}</pre>
        </motion.div>
      </section>

      <section className="stats">
        {content.stats.map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
      </section>

      <section id="services" className="section">
        <div className="sectionTitle"><span>Services</span><h2>Что делает MyFond</h2></div>
        <div className="cards four">
          {content.services.map((service, index) => {
            const Icon = icons[index] || Layers3;
            return <article className="card" key={service.title}><Icon /><h3>{service.title}</h3><p>{service.description}</p><div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>;
          })}
        </div>
      </section>

      <section id="work" className="section workSection">
        <div className="sectionTitle"><span>Tasks</span><h2>Задачи движутся горизонтальной лентой</h2></div>
        <div className="workMarquee">
          <div className="workTrack">
            {movingWorkItems.map((item, index) => (
              <article className="workCard" key={item.title + index}>
                <b>{item.metric}</b>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="section timeline">
        <div className="sectionTitle"><span>Process</span><h2>Архитектура без переделок</h2></div>
        {content.process.map((step) => <article className="step" key={step.title}><i /><div><h3>{step.title}</h3><p>{step.description}</p></div></article>)}
      </section>

      <section id="contact" className="section contact">
        <div>
          <span className="eyebrow">Start</span>
          <h2>Расскажите задачу — сайт уже готов принимать заявки.</h2>
          <p className="lead">Позже эту же точку можно подключить к Telegram-боту, CRM, email и админке.</p>
        </div>
        <form onSubmit={onSubmit}>
          <input name="name" placeholder="Ваше имя" required minLength={2} />
          <input name="email" placeholder="Email" type="email" />
          <textarea name="message" placeholder="Что нужно сделать?" required minLength={10} />
          <button className="btn primary" disabled={loading}>{loading ? "Отправляю..." : "Отправить"}<Send size={18} /></button>
          {status && <p className="formStatus">{status}</p>}
        </form>
      </section>

      <footer>© {new Date().getFullYear()} MyFond. Digital foundation for useful projects.</footer>
    </main>
  );
}
