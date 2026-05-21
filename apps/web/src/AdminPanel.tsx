import { FormEvent, useEffect, useState } from "react";
import type { ProcessStep, Service, SiteContent, WorkItem } from "@myfond/shared";
import { siteContent as fallbackContent } from "@myfond/shared";
import { loadAdminContent, saveAdminContent } from "./api";

type StatItem = SiteContent["stats"][number];

type SectionName = "services" | "work" | "process" | "stats";

const emptyService: Service = { title: "Новая услуга", description: "Описание услуги", tags: ["New"] };
const emptyWork: WorkItem = { title: "Новая работа", description: "Описание работы", metric: "New" };
const emptyStep: ProcessStep = { title: "Новый шаг", description: "Описание шага" };
const emptyStat: StatItem = { label: "Показатель", value: "0" };

function splitTags(value: string) {
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
}

export default function AdminPanel() {
  const [token, setToken] = useState(() => localStorage.getItem("myfond-admin-token") || "");
  const [content, setContent] = useState<SiteContent>(fallbackContent);
  const [status, setStatus] = useState("Введите admin token и загрузите контент.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem("myfond-admin-token", token);
  }, [token]);

  async function loadContent() {
    setLoading(true);
    setStatus("Загружаю контент...");
    try {
      const data = await loadAdminContent(token);
      setContent(data);
      setStatus("Контент загружен.");
    } catch {
      setStatus("Не удалось загрузить. Проверьте admin token и API.");
    } finally {
      setLoading(false);
    }
  }

  async function saveContent(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Сохраняю изменения...");
    try {
      const result = await saveAdminContent(token, content);
      setContent(result.data);
      setStatus("Сохранено. Обновите главную страницу, чтобы увидеть изменения.");
    } catch {
      setStatus("Не удалось сохранить. Проверьте обязательные поля и token.");
    } finally {
      setLoading(false);
    }
  }

  function updateText(path: string, value: string) {
    setContent((current) => {
      const next = structuredClone(current);
      const keys = path.split(".");
      let target: any = next;
      for (const key of keys.slice(0, -1)) target = target[key];
      target[keys.at(-1)!] = value;
      return next;
    });
  }

  function updateArrayItem<T extends SectionName>(section: T, index: number, patch: Partial<SiteContent[T][number]>) {
    setContent((current) => {
      const next = structuredClone(current);
      (next[section][index] as any) = { ...(next[section][index] as any), ...patch };
      return next;
    });
  }

  function addItem(section: SectionName) {
    setContent((current) => {
      const next = structuredClone(current);
      const item = section === "services" ? emptyService : section === "work" ? emptyWork : section === "process" ? emptyStep : emptyStat;
      (next[section] as any[]).push(structuredClone(item));
      return next;
    });
  }

  function removeItem(section: SectionName, index: number) {
    setContent((current) => {
      const next = structuredClone(current);
      (next[section] as any[]).splice(index, 1);
      return next;
    });
  }

  return (
    <main className="adminPage">
      <header className="adminHeader">
        <a className="brand" href="/">
          <span>M</span>
          <div><strong>MyFond Admin</strong><small>Content control panel</small></div>
        </a>
        <a className="btn ghost" href="/">На сайт</a>
      </header>

      <form className="adminShell" onSubmit={saveContent}>
        <aside className="adminSidebar">
          <h1>Админ панель</h1>
          <p>Здесь можно менять обложку, услуги, работы, процесс и цифры на сайте.</p>
          <label>Admin token</label>
          <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="myfond-admin-token" />
          <button type="button" className="btn ghost" onClick={loadContent} disabled={loading}>Загрузить</button>
          <button type="submit" className="btn primary" disabled={loading}>Сохранить</button>
          <p className="formStatus">{status}</p>
        </aside>

        <section className="adminEditor">
          <div className="adminBlock">
            <h2>Бренд</h2>
            <input value={content.brand.name} onChange={(e) => updateText("brand.name", e.target.value)} placeholder="Название" />
            <input value={content.brand.tagline} onChange={(e) => updateText("brand.tagline", e.target.value)} placeholder="Tagline" />
            <textarea value={content.brand.description} onChange={(e) => updateText("brand.description", e.target.value)} placeholder="Описание" />
          </div>

          <div className="adminBlock">
            <h2>Обложка</h2>
            <input value={content.hero.eyebrow} onChange={(e) => updateText("hero.eyebrow", e.target.value)} placeholder="Eyebrow" />
            <textarea value={content.hero.title} onChange={(e) => updateText("hero.title", e.target.value)} placeholder="Главный заголовок" />
            <textarea value={content.hero.subtitle} onChange={(e) => updateText("hero.subtitle", e.target.value)} placeholder="Подзаголовок" />
            <input value={content.hero.primaryCta} onChange={(e) => updateText("hero.primaryCta", e.target.value)} placeholder="Главная кнопка" />
            <input value={content.hero.secondaryCta} onChange={(e) => updateText("hero.secondaryCta", e.target.value)} placeholder="Вторая кнопка" />
          </div>

          <EditableList title="Услуги" section="services" items={content.services} addItem={addItem} removeItem={removeItem}>
            {(service, index) => <>
              <input value={service.title} onChange={(e) => updateArrayItem("services", index, { title: e.target.value })} />
              <textarea value={service.description} onChange={(e) => updateArrayItem("services", index, { description: e.target.value })} />
              <input value={service.tags.join(", ")} onChange={(e) => updateArrayItem("services", index, { tags: splitTags(e.target.value) })} placeholder="Теги через запятую" />
            </>}
          </EditableList>

          <EditableList title="Работы / задачи" section="work" items={content.work} addItem={addItem} removeItem={removeItem}>
            {(item, index) => <>
              <input value={item.metric} onChange={(e) => updateArrayItem("work", index, { metric: e.target.value })} />
              <input value={item.title} onChange={(e) => updateArrayItem("work", index, { title: e.target.value })} />
              <textarea value={item.description} onChange={(e) => updateArrayItem("work", index, { description: e.target.value })} />
            </>}
          </EditableList>

          <EditableList title="Процесс" section="process" items={content.process} addItem={addItem} removeItem={removeItem}>
            {(item, index) => <>
              <input value={item.title} onChange={(e) => updateArrayItem("process", index, { title: e.target.value })} />
              <textarea value={item.description} onChange={(e) => updateArrayItem("process", index, { description: e.target.value })} />
            </>}
          </EditableList>

          <EditableList title="Статистика" section="stats" items={content.stats} addItem={addItem} removeItem={removeItem}>
            {(item, index) => <>
              <input value={item.value} onChange={(e) => updateArrayItem("stats", index, { value: e.target.value })} />
              <input value={item.label} onChange={(e) => updateArrayItem("stats", index, { label: e.target.value })} />
            </>}
          </EditableList>
        </section>
      </form>
    </main>
  );
}

function EditableList<T>({ title, section, items, addItem, removeItem, children }: {
  title: string;
  section: SectionName;
  items: T[];
  addItem: (section: SectionName) => void;
  removeItem: (section: SectionName, index: number) => void;
  children: (item: T, index: number) => JSX.Element;
}) {
  return (
    <div className="adminBlock">
      <div className="adminBlockTitle"><h2>{title}</h2><button type="button" className="btn ghost" onClick={() => addItem(section)}>Добавить</button></div>
      {items.map((item, index) => (
        <article className="adminItem" key={index}>
          <div className="adminItemTop"><strong>#{index + 1}</strong><button type="button" onClick={() => removeItem(section, index)}>Удалить</button></div>
          {children(item, index)}
        </article>
      ))}
    </div>
  );
}
