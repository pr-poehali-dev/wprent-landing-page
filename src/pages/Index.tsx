import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type IconName = React.ComponentProps<typeof Icon>["name"];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Ресторан «Сакура»",
    category: "Ресторан",
    industry: "horeca",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/0e30e816-0b77-474f-a860-74f7672dcfc6.jpg",
  },
  {
    id: 2,
    title: "Клиника «МедЦентр»",
    category: "Медицина",
    industry: "med",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/59c19798-8bcd-4d2f-8770-7c83a4fee0ed.jpg",
  },
  {
    id: 3,
    title: "Недвижимость «Элит»",
    category: "Недвижимость",
    industry: "realty",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/5347bb71-108d-40b0-9269-ee26a4193e92.jpg",
  },
  {
    id: 4,
    title: "Фитнес «PowerZone»",
    category: "Фитнес",
    industry: "sport",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/a594a3fd-1db9-4322-be64-7b860d745f02.jpg",
  },
  {
    id: 5,
    title: "Салон «Belle»",
    category: "Красота",
    industry: "beauty",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/fec39373-6d64-4463-8530-7b2743604c48.jpg",
  },
  {
    id: 6,
    title: "Юридическое бюро «Lexum»",
    category: "Юридические",
    industry: "law",
    img: "https://cdn.poehali.dev/projects/070d1355-7f49-454e-b40d-a9faf2f1ae1e/files/679ff6f9-4d18-4834-ae68-62118574ba45.jpg",
  },
];

const INDUSTRIES = [
  { id: "all", label: "Все отрасли" },
  { id: "horeca", label: "Рестораны" },
  { id: "med", label: "Медицина" },
  { id: "realty", label: "Недвижимость" },
  { id: "sport", label: "Фитнес" },
  { id: "beauty", label: "Красота" },
  { id: "law", label: "Юридические" },
];

const FEATURES = [
  { icon: "Zap", title: "Быстрый запуск", desc: "Сайт готов за 24 часа после оплаты" },
  { icon: "Shield", title: "Техподдержка 24/7", desc: "Решаем проблемы в течение 2 часов" },
  { icon: "RefreshCw", title: "Безлимит правок", desc: "Правим тексты, фото, цены бесплатно" },
  { icon: "Globe", title: "Хостинг включён", desc: "Серверы, SSL-сертификат, домен .ru" },
  { icon: "BarChart3", title: "Аналитика", desc: "Яндекс.Метрика и Google Analytics" },
  { icon: "Smartphone", title: "Мобильная версия", desc: "Адаптация под все устройства" },
  { icon: "Search", title: "SEO-настройка", desc: "Базовая оптимизация под поисковики" },
  { icon: "Lock", title: "Безопасность", desc: "Защита от DDoS и вирусов" },
];

const PLANS = [
  {
    name: "Старт",
    price: "1 990",
    desc: "Для начинающего бизнеса",
    features: ["До 5 страниц", "Базовый дизайн", "Хостинг включён", "Поддержка 8/5", "1 правка/месяц"],
    accent: false,
  },
  {
    name: "Бизнес",
    price: "3 490",
    desc: "Самый популярный выбор",
    features: ["До 15 страниц", "Премиум дизайн", "Хостинг + CDN", "Поддержка 24/7", "Безлимит правок", "SEO-оптимизация"],
    accent: true,
  },
  {
    name: "Про",
    price: "6 990",
    desc: "Для крупных компаний",
    features: ["Неограниченно страниц", "Эксклюзивный дизайн", "Выделенный сервер", "Персональный менеджер", "Безлимит правок", "SEO + Реклама"],
    accent: false,
  },
];

const FAQ = [
  { q: "Что будет, если я перестану платить?", a: "Сайт будет приостановлен через 3 дня после неоплаты. Все ваши данные сохраняются 30 дней — вы можете возобновить подписку в любой момент." },
  { q: "Могу ли я выкупить сайт?", a: "Да! Вы можете выкупить сайт в любой момент за фиксированную стоимость, которая зависит от выбранного тарифа. Цены указаны в таблице сравнения." },
  { q: "Кто занимается обновлением контента?", a: "Мы! Просто напишите нам в чат или на почту — внесём правки в течение 24 часов на тарифе Старт и в течение 2 часов на Бизнес и Про." },
  { q: "Сайт будет уникальным или шаблонным?", a: "Каждый сайт делается индивидуально под ваш бизнес. Мы используем Betheme как основу, но дизайн адаптируем под ваш фирменный стиль, цвета и контент." },
  { q: "Включён ли домен и хостинг?", a: "Да, домен .ru и хостинг уже включены в стоимость аренды. Для Бизнес и Про тарифов также подключается CDN для быстрой загрузки." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const filtered = activeFilter === "all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g => g.industry === activeFilter);

  return (
    <div className="min-h-screen font-golos noise-overlay" style={{ background: 'hsl(220 22% 6%)' }}>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "glass py-3" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg neon-border border flex items-center justify-center animate-pulse-neon">
              <span className="text-sm font-oswald font-bold neon-text">W</span>
            </div>
            <span className="font-oswald font-bold text-xl tracking-wider">WEB<span className="neon-text">RENT</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Возможности", "Примеры", "Тарифы", "Контакты"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-golos text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <button className="neon-btn px-5 py-2 rounded-lg text-sm font-golos font-semibold">
            Получить сайт
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-bg relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] rounded-full bg-neon/8 blur-[120px] animate-float" />
          <div className="absolute bottom-1/3 right-1/5 w-72 h-72 rounded-full bg-sky-400/6 blur-[80px] animate-float" style={{ animationDelay: "1.8s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cyan-500/4 blur-[100px]" />
          {/* Thin horizontal glow line */}
          <div className="absolute top-[45%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-neon/5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-sm text-muted-foreground font-golos">Более 500 сайтов запущено в 2024</span>
          </div>

          <h1 className="font-oswald font-bold leading-none mb-6">
            <span
              className="block text-7xl md:text-[10rem] lg:text-[12rem] text-foreground opacity-0 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              АРЕНДА
            </span>
            <span
              className="block text-5xl md:text-7xl lg:text-8xl text-gradient opacity-0 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              САЙТОВ ДЛЯ БИЗНЕСА
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-golos leading-relaxed opacity-0 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            Профессиональный сайт на базе Betheme за&nbsp;
            <span className="neon-text font-semibold">1&nbsp;990 ₽/месяц</span>
            &nbsp;— без покупки, без разработчика, без головной боли
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <button className="neon-btn px-8 py-4 rounded-xl text-base font-golos font-bold flex items-center justify-center gap-2">
              <Icon name="Rocket" size={18} />
              Запустить сайт
            </button>
            <button className="px-8 py-4 rounded-xl text-base font-golos font-semibold border border-border hover:border-neon/50 transition-colors flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
              <Icon name="Play" size={18} />
              Посмотреть примеры
            </button>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "1s" }}>
            {[["500+", "сайтов"], ["24ч", "запуск"], ["99.9%", "аптайм"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="font-oswald text-3xl font-bold neon-text">{val}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border/50 bg-surface/50 overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {["Betheme", "500+ дизайнов", "SSL бесплатно", "Поддержка 24/7", "Домен включён", "Мобайл-адаптация", "SEO готов", "Без разработчика"].map((t) => (
                <span key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-neon inline-block" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="возможности" className="py-32 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Всё включено</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold text-foreground">ВСЁ, ЧТО НУЖНО</h2>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold text-gradient">ДЛЯ БИЗНЕСА</h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat, i) => (
            <AnimatedSection key={feat.title}>
              <div
                className="p-6 rounded-2xl bg-surface border border-border card-hover cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center mb-4">
                  <Icon name={feat.icon as IconName} size={22} className="text-neon" />
                </div>
                <h3 className="font-oswald font-semibold text-lg mb-1">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="примеры" className="py-32 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Галерея работ</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold">ПРИМЕРЫ <span className="text-gradient">САЙТОВ</span></h2>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveFilter(ind.id)}
                className={`px-4 py-2 rounded-full text-sm font-golos transition-all duration-300 border ${
                  activeFilter === ind.id
                    ? "neon-btn border-transparent"
                    : "border-border text-muted-foreground hover:border-neon/40 hover:text-foreground"
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-border cursor-pointer card-hover"
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                opacity: 0,
                animation: `fade-in 0.5s ease-out ${i * 0.1}s forwards`,
              }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 ${hoveredCard === item.id ? "opacity-100" : "opacity-70"}`} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-xs font-oswald tracking-widest text-neon uppercase">{item.category}</span>
                <h3 className="font-oswald font-bold text-xl text-white mt-1">{item.title}</h3>
                <div className={`flex items-center gap-2 mt-2 transition-all duration-300 ${hoveredCard === item.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  <span className="text-sm text-muted-foreground">Посмотреть подробнее</span>
                  <Icon name="ArrowRight" size={14} className="text-neon" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-32 max-w-5xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Считай сам</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold">АРЕНДА <span className="text-gradient">VS ПОКУПКА</span></h2>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="rounded-3xl overflow-hidden border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 font-oswald text-lg font-semibold">Параметр</th>
                  <th className="p-6 text-center font-oswald text-lg font-semibold neon-text">Аренда</th>
                  <th className="p-6 text-center font-oswald text-lg font-semibold text-muted-foreground">Покупка</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Стоимость запуска", "0 ₽", "80–300 тыс ₽"],
                  ["Ежемесячные расходы", "от 1 990 ₽", "5–15 тыс ₽ (поддержка)"],
                  ["Срок запуска", "24 часа", "1–3 месяца"],
                  ["Обновление дизайна", "Включено", "Доп. оплата"],
                  ["Техническая поддержка", "Включена", "Доп. оплата"],
                  ["Хостинг и домен", "Включены", "Доп. оплата"],
                ].map(([param, rent, buy], i) => (
                  <tr key={param} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-surface/30" : ""}`}>
                    <td className="p-5 text-muted-foreground font-golos">{param}</td>
                    <td className="p-5 text-center font-golos font-semibold text-neon">{rent}</td>
                    <td className="p-5 text-center font-golos text-muted-foreground">{buy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </section>

      {/* HOW IT WORKS */}
      <section id="как-это-работает" className="py-32 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-20">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Просто и быстро</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold">КАК ЭТО <span className="text-gradient">РАБОТАЕТ</span></h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px border-t border-dashed border-neon/30" />

          {[
            { step: "01", icon: "MousePointer2", title: "Выберите шаблон", desc: "Откройте галерею, выберите дизайн из 500+ шаблонов Betheme, подходящий для вашего бизнеса" },
            { step: "02", icon: "PenLine", title: "Заполните бриф", desc: "Расскажите о своём бизнесе, загрузите логотип и фото. Займёт 15 минут — делаем всё остальное мы" },
            { step: "03", icon: "Rocket", title: "Получите сайт", desc: "Через 24 часа ваш сайт уже онлайн. Мы всё настроим: домен, хостинг, SEO и аналитику" },
          ].map((s) => (
            <AnimatedSection key={s.step}>
              <div className="relative p-8 rounded-2xl bg-surface border border-border group hover:border-neon/40 transition-all duration-300">
                <div className="absolute -top-4 -left-2 font-oswald text-7xl font-bold text-neon/5 group-hover:text-neon/10 transition-colors leading-none">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center mb-5 relative">
                  <Icon name={s.icon as IconName} size={24} className="text-neon" />
                </div>
                <h3 className="font-oswald font-bold text-2xl mb-3">{s.title}</h3>
                <p className="text-muted-foreground font-golos leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="rounded-3xl border border-neon/20 bg-neon/5 p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: "Award", title: "Гарантия возврата", desc: "14 дней без вопросов" },
              { icon: "Users", title: "500+ клиентов", desc: "По всей России" },
              { icon: "Clock", title: "Запуск 24 часа", desc: "Гарантированно" },
              { icon: "HeartHandshake", title: "Поддержка", desc: "Всегда на связи" },
            ].map((t) => (
              <div key={t.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name={t.icon as IconName} size={22} className="text-neon" />
                </div>
                <h3 className="font-oswald font-bold text-lg">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* PRICING */}
      <section id="тарифы" className="py-32 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Прозрачные цены</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold">ВЫБЕРИТЕ <span className="text-gradient">ТАРИФ</span></h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <AnimatedSection key={plan.name}>
              <div
                className={`relative rounded-3xl p-8 h-full flex flex-col border transition-all duration-300 ${
                  plan.accent
                    ? "border-neon/60 bg-neon/5 shadow-[0_0_60px_hsl(145_80%_52%/0.1)]"
                    : "border-border bg-surface hover:border-neon/30"
                }`}
              >
                {plan.accent && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-neon text-background text-xs font-oswald font-bold tracking-wider">
                    ПОПУЛЯРНЫЙ
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-oswald font-bold text-2xl mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="mb-8">
                  <span className="font-oswald text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">₽/мес</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <Icon name="Check" size={16} className="text-neon flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-golos font-semibold transition-all duration-300 ${
                    plan.accent
                      ? "neon-btn"
                      : "border border-border hover:border-neon/50 hover:text-neon"
                  }`}
                >
                  Выбрать тариф
                </button>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 max-w-3xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">FAQ</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold">ЧАСТЫЕ <span className="text-gradient">ВОПРОСЫ</span></h2>
          </div>
        </AnimatedSection>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <AnimatedSection key={i}>
              <div
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openFaq === i ? "border-neon/40 bg-neon/5" : "border-border bg-surface hover:border-neon/20"
                }`}
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-golos font-semibold">{item.q}</span>
                  <Icon
                    name="ChevronDown"
                    size={20}
                    className={`text-neon flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-muted-foreground font-golos leading-relaxed text-sm animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="контакты" className="py-32 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="rounded-3xl border border-border bg-surface p-12 md:p-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <span className="text-xs font-oswald tracking-[0.3em] text-neon uppercase mb-4 block">Контакты</span>
                <h2 className="font-oswald text-4xl md:text-5xl font-bold mb-6">НАЧНИТЕ <span className="text-gradient">СЕГОДНЯ</span></h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">Оставьте заявку и мы свяжемся с вами в течение 30 минут. Бесплатная консультация по выбору тарифа и дизайна.</p>

                <div className="space-y-4">
                  {[
                    { icon: "Phone", val: "+7 (800) 000-00-00" },
                    { icon: "Mail", val: "hello@webrent.ru" },
                    { icon: "MapPin", val: "Москва, ул. Пушкина, 10" },
                  ].map((c) => (
                    <div key={c.val} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
                        <Icon name={c.icon as IconName} size={16} className="text-neon" />
                      </div>
                      <span className="text-muted-foreground">{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    className="col-span-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-neon/50 focus:outline-none font-golos text-sm transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Телефон"
                    className="col-span-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-neon/50 focus:outline-none font-golos text-sm transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Название бизнеса"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-neon/50 focus:outline-none font-golos text-sm transition-colors"
                />
                <select className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-neon/50 focus:outline-none font-golos text-sm text-muted-foreground transition-colors">
                  <option value="">Выберите тариф</option>
                  <option value="start">Старт — 1 990 ₽/мес</option>
                  <option value="biz">Бизнес — 3 490 ₽/мес</option>
                  <option value="pro">Про — 6 990 ₽/мес</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Опишите ваш бизнес..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-neon/50 focus:outline-none font-golos text-sm transition-colors resize-none"
                />
                <button className="neon-btn w-full py-4 rounded-xl font-golos font-bold text-base flex items-center justify-center gap-2">
                  <Icon name="Send" size={18} />
                  Отправить заявку
                </button>
                <p className="text-xs text-muted-foreground text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg neon-border border flex items-center justify-center">
              <span className="text-xs font-oswald font-bold neon-text">W</span>
            </div>
            <span className="font-oswald font-bold text-lg">WEB<span className="neon-text">RENT</span></span>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            ООО «ВебРент» · ИНН 0000000000 · ОГРН 000000000000000
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-neon transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-neon transition-colors">Договор оферты</a>
          </div>
        </div>
      </footer>
    </div>
  );
}