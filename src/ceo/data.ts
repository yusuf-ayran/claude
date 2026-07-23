// CEO Client Briefing — copy, demo data and tokens from the design handoff
// (design_handoff_ceo_client_dashboard, "CEO Client Dashboard v3"). All EN/AR
// strings are final handoff copy; the DATA object doubles as the API contract.

export type Lang = "en" | "ar";
export type Screen = "overview" | "approvals" | "analytics" | "calendar" | "roadmap";
export type Decision = "approved" | "changes";
export type StatusKey =
  | "scheduled"
  | "inReview"
  | "drafting"
  | "published"
  | "accepted"
  | "complete"
  | "inProgress"
  | "upcoming";

export interface Approval {
  id: string;
  tag: string;
  meta: string;
  title: string;
  excerpt: string;
}
export interface HistoryItem {
  tag: string;
  title: string;
  meta: string;
  sk: StatusKey;
}
export interface PipelineItem {
  date: string;
  channel: string;
  title: string;
  sk: StatusKey;
}
export interface Week {
  label: string;
  items: PipelineItem[];
}
export interface Channel {
  name: string;
  growth: string;
  followers: string;
  impressions: string;
  engagement: string;
  posts: string;
}
export interface TopPost {
  title: string;
  channel: string;
  metric: string;
}
export interface PressItem {
  date: string;
  outlet: string;
  title: string;
}
export interface Deliverable {
  label: string;
  done: boolean;
}
export interface Phase {
  num: string;
  name: string;
  pct: string;
  sk: StatusKey;
  timeframe: string;
  deliverables: Deliverable[];
}
export interface LangData {
  approvals: Approval[];
  history: HistoryItem[];
  pipeline: PipelineItem[];
  weeks: Week[];
  channels: Channel[];
  topPosts: TopPost[];
  press: PressItem[];
  roadmap: Phase[];
  months: string[];
  days: string[];
}

// ——— design tokens (handoff §Design Tokens) ———
export const BG = "#0B1413";
export const INK = "#E8EFED";
export const SECONDARY = "#A9BDB9";
export const MUTED = "#7E938F";
export const SOFT = "#C8D6D2";
export const ACCENT = "#3FB8A5";
export const ACCENT_HOVER = "#5ECDBB";
export const HAIR_HEAD = "rgba(232,239,237,0.14)";
export const HAIR_MAJOR = "rgba(232,239,237,0.08)";
export const HAIR_MINOR = "rgba(232,239,237,0.07)";
export const BAR_DIM = "rgba(232,239,237,0.18)";

export const STATUS_COLORS: Record<StatusKey, string> = {
  scheduled: ACCENT,
  inReview: SOFT,
  drafting: MUTED,
  complete: ACCENT,
  inProgress: SOFT,
  upcoming: MUTED,
  published: ACCENT,
  accepted: ACCENT,
};

export const FONT_EN = "'Manrope','IBM Plex Sans Arabic',sans-serif";
export const FONT_AR = "'IBM Plex Sans Arabic','Manrope',sans-serif";

// Presence-index 12-month trend (last value = current score) and per-channel
// 12-month trends, in handoff order (LinkedIn, X).
export const PRESENCE_TREND = [42, 45, 44, 50, 53, 51, 58, 60, 63, 66, 70, 78];
export const CHANNEL_TRENDS = [
  [30, 34, 32, 40, 44, 42, 50, 55, 53, 60, 64, 70],
  [22, 26, 24, 28, 32, 30, 36, 40, 38, 44, 46, 50],
];

export const T = {
  en: {
    portalLabel: "Client Briefing",
    navOverview: "Overview",
    navApprovals: "Approvals",
    navAnalytics: "Analytics",
    navCalendar: "Calendar",
    navRoadmap: "Roadmap",
    viewAll: "View all",
    presenceIndex: "Presence Index",
    presenceDelta: "+6 this quarter",
    presenceNote: "Composite of reach, share of voice and authority across your channels.",
    pendingLabel: "Awaiting decision",
    approvalsTitle: "For your decision",
    approvalsSub: "Everything queued for your sign-off, and a record of your recent decisions.",
    recentDecisions: "Recent decisions",
    allClear: "Nothing awaiting your decision — all clear.",
    approve: "Approve",
    requestChanges: "Request changes",
    approved: "Approved",
    changesRequested: "Changes requested",
    pipelineTitle: "Content pipeline",
    channelsTitle: "Channels",
    analyticsSub:
      "Channel performance over the last twelve months, your best-performing content, and press coverage.",
    topContent: "Top content",
    pressCoverage: "Press coverage",
    followers: "Followers",
    impressions: "Impressions / mo",
    engagement: "Engagement",
    postsMo: "Posts / mo",
    calendarSub: "The next three weeks of planned content and appearances.",
    roadmapSub: "The four phases of your engagement, with deliverables per phase.",
    footerNote: "Prepared by your CEO strategy team · Updated daily at 6:00 AM AST",
    footerBrand: "CEO — A full leadership presence ecosystem",
    heroSub:
      "Three items await your decision. Your presence index rose on the back of last week’s Asharq interview.",
    goodMorning: "Good morning",
    complete: "Complete",
    inProgress: "In progress",
    upcoming: "Q4 2026",
    scheduled: "Scheduled",
    inReview: "In review",
    drafting: "Drafting",
    published: "Published",
    accepted: "Accepted",
  },
  ar: {
    portalLabel: "موجز العميل",
    navOverview: "نظرة عامة",
    navApprovals: "الموافقات",
    navAnalytics: "التحليلات",
    navCalendar: "التقويم",
    navRoadmap: "خارطة الطريق",
    viewAll: "عرض الكل",
    presenceIndex: "مؤشر الحضور",
    presenceDelta: "+6 هذا الربع",
    presenceNote: "مؤشر مركّب للانتشار وحصة الصوت والموثوقية عبر قنواتك.",
    pendingLabel: "بانتظار القرار",
    approvalsTitle: "لقرارك",
    approvalsSub: "كل ما ينتظر اعتمادك، وسجل قراراتك الأخيرة.",
    recentDecisions: "القرارات الأخيرة",
    allClear: "لا يوجد ما ينتظر قرارك — كل شيء منجز.",
    approve: "اعتماد",
    requestChanges: "طلب تعديلات",
    approved: "معتمد",
    changesRequested: "طُلبت تعديلات",
    pipelineTitle: "خطة المحتوى",
    channelsTitle: "القنوات",
    analyticsSub: "أداء القنوات خلال الاثني عشر شهرًا الماضية، وأفضل المحتوى، والتغطية الصحفية.",
    topContent: "أفضل المحتوى",
    pressCoverage: "التغطية الصحفية",
    followers: "المتابعون",
    impressions: "الظهور شهريًا",
    engagement: "التفاعل",
    postsMo: "منشورات شهريًا",
    calendarSub: "الأسابيع الثلاثة القادمة من المحتوى والمشاركات المخطط لها.",
    roadmapSub: "المراحل الأربع لشراكتك، مع مخرجات كل مرحلة.",
    footerNote: "أُعدّ بواسطة فريق استراتيجية CEO · يُحدَّث يوميًا الساعة 6:00 صباحًا",
    footerBrand: "CEO — منظومة حضور قيادي متكاملة",
    heroSub: "ثلاثة عناصر بانتظار قرارك. ارتفع مؤشر حضورك بعد مقابلة الشرق الأسبوع الماضي.",
    goodMorning: "صباح الخير",
    complete: "مكتملة",
    inProgress: "قيد التنفيذ",
    upcoming: "الربع الرابع 2026",
    scheduled: "مجدول",
    inReview: "قيد المراجعة",
    drafting: "قيد الإعداد",
    published: "منشور",
    accepted: "مقبولة",
  },
} as const;

// Widened so `T.en` and `T.ar` share one assignable shape (the `as const`
// above gives each language distinct string-literal types otherwise).
export type Strings = Record<keyof (typeof T)["en"], string>;

export const DATA: Record<Lang, LangData> = {
  en: {
    approvals: [
      {
        id: "a1",
        tag: "LinkedIn",
        meta: "Post · publishes Sun 26 Jul",
        title: "Leadership lessons from our Vision 2030 partnerships",
        excerpt:
          "“The most valuable thing we built this year wasn’t a product — it was trust across three ministries and forty founders…”",
      },
      {
        id: "a2",
        tag: "Press",
        meta: "Op-ed · Arab News · due Thu 30 Jul",
        title: "The next decade of Saudi fintech",
        excerpt:
          "Draft v3 — 850 words. Argues regulation-first markets will out-innovate. Your edits from Sunday are incorporated.",
      },
      {
        id: "a3",
        tag: "Speaking",
        meta: "Invitation · respond by 28 Jul",
        title: "FII 2026 — panel on sovereign capital & innovation",
        excerpt:
          "Riyadh, 27–29 Oct. 40-min moderated panel alongside two fund CEOs. Team recommends accepting.",
      },
    ],
    history: [
      {
        tag: "LinkedIn",
        title: "Post: Ramadan reflections on leadership",
        meta: "Approved 15 Jul · published 16 Jul",
        sk: "published",
      },
      {
        tag: "Press",
        title: "Asharq Bloomberg — TV interview",
        meta: "Accepted 8 Jul · aired 18 Jul",
        sk: "accepted",
      },
      {
        tag: "X",
        title: "Thread: hiring philosophy",
        meta: "Changes requested 6 Jul · revised & published 10 Jul",
        sk: "published",
      },
    ],
    pipeline: [
      { date: "Sun 26 Jul", channel: "LinkedIn", title: "Quote card: talent & culture", sk: "scheduled" },
      {
        date: "Tue 28 Jul",
        channel: "X",
        title: "Thread: Q2 results, the story behind the numbers",
        sk: "inReview",
      },
      {
        date: "Wed 29 Jul",
        channel: "Press",
        title: "Bloomberg Asharq — interview briefing",
        sk: "drafting",
      },
      { date: "Sun 2 Aug", channel: "LinkedIn", title: "Article: Why we build from Riyadh", sk: "drafting" },
      {
        date: "Mon 10 Aug",
        channel: "Speaking",
        title: "Misk Global Forum — keynote outline",
        sk: "drafting",
      },
    ],
    weeks: [
      {
        label: "Week of 26 July",
        items: [
          { date: "Sun 26 Jul", channel: "LinkedIn", title: "Quote card: talent & culture", sk: "scheduled" },
          {
            date: "Tue 28 Jul",
            channel: "X",
            title: "Thread: Q2 results, the story behind the numbers",
            sk: "inReview",
          },
          {
            date: "Wed 29 Jul",
            channel: "Press",
            title: "Bloomberg Asharq — interview briefing",
            sk: "drafting",
          },
        ],
      },
      {
        label: "Week of 2 August",
        items: [
          {
            date: "Sun 2 Aug",
            channel: "LinkedIn",
            title: "Article: Why we build from Riyadh",
            sk: "drafting",
          },
          {
            date: "Wed 5 Aug",
            channel: "Podcast",
            title: "The Founders Majlis — recording session",
            sk: "scheduled",
          },
        ],
      },
      {
        label: "Week of 9 August",
        items: [
          {
            date: "Mon 10 Aug",
            channel: "Speaking",
            title: "Misk Global Forum — keynote outline",
            sk: "drafting",
          },
          {
            date: "Thu 13 Aug",
            channel: "LinkedIn",
            title: "Monthly recap: July highlights",
            sk: "drafting",
          },
        ],
      },
    ],
    channels: [
      {
        name: "LinkedIn",
        growth: "+3.1% this month",
        followers: "48.2K",
        impressions: "512K",
        engagement: "6.8%",
        posts: "14",
      },
      {
        name: "X (Twitter)",
        growth: "+1.9% this month",
        followers: "31.5K",
        impressions: "288K",
        engagement: "4.2%",
        posts: "22",
      },
    ],
    topPosts: [
      {
        title: "Article: Why we build from Riyadh (teaser)",
        channel: "LinkedIn · 12 Jul",
        metric: "84K impressions",
      },
      { title: "Thread: lessons from our Series C", channel: "X · 3 Jul", metric: "51K views" },
      {
        title: "Clip: Asharq interview on fintech regulation",
        channel: "LinkedIn · 19 Jul",
        metric: "3.2K reactions",
      },
    ],
    press: [
      { date: "18 Jul", outlet: "Bloomberg Asharq · TV + digital", title: "Interview: the fintech decade" },
      {
        date: "12 Jul",
        outlet: "Arab News · Business",
        title: "Quoted in Saudi venture market analysis",
      },
      { date: "5 Jul", outlet: "Argaam", title: "Coverage of Series C announcement" },
    ],
    roadmap: [
      {
        num: "01",
        name: "Foundation & positioning",
        pct: "100%",
        sk: "complete",
        timeframe: "Q1 2026",
        deliverables: [
          { label: "Executive brand audit & perception study", done: true },
          { label: "Positioning & messaging house", done: true },
          { label: "Personal visual identity & photography", done: true },
        ],
      },
      {
        num: "02",
        name: "Narrative & voice",
        pct: "100%",
        sk: "complete",
        timeframe: "Q2 2026",
        deliverables: [
          { label: "Voice & tone guidelines", done: true },
          { label: "Three signature themes defined", done: true },
          { label: "Ghostwriting playbook & cadence", done: true },
        ],
      },
      {
        num: "03",
        name: "Visibility & media",
        pct: "65%",
        sk: "inProgress",
        timeframe: "Q3 2026",
        deliverables: [
          { label: "Media relations program launched", done: true },
          { label: "Two tier-1 interviews (1 of 2 aired)", done: false },
          { label: "Speaking circuit entry — FII, Misk", done: false },
        ],
      },
      {
        num: "04",
        name: "Authority & thought leadership",
        pct: "0%",
        sk: "upcoming",
        timeframe: "Q4 2026",
        deliverables: [
          { label: "Monthly op-ed program", done: false },
          { label: "Industry report authorship", done: false },
          { label: "Podcast presence & owned series exploration", done: false },
        ],
      },
    ],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  ar: {
    approvals: [
      {
        id: "a1",
        tag: "لينكدإن",
        meta: "منشور · يُنشر الأحد 26 يوليو",
        title: "دروس قيادية من شراكاتنا في رؤية 2030",
        excerpt: "«أثمن ما بنيناه هذا العام لم يكن منتجًا — بل ثقة امتدت عبر ثلاث وزارات وأربعين مؤسسًا…»",
      },
      {
        id: "a2",
        tag: "صحافة",
        meta: "مقال رأي · عرب نيوز · الموعد الخميس 30 يوليو",
        title: "العقد القادم للتقنية المالية السعودية",
        excerpt: "المسودة الثالثة — 850 كلمة. تدمج تعديلاتك من يوم الأحد.",
      },
      {
        id: "a3",
        tag: "متحدث",
        meta: "دعوة · الرد قبل 28 يوليو",
        title: "مبادرة مستقبل الاستثمار 2026 — جلسة رأس المال السيادي والابتكار",
        excerpt: "الرياض، 27–29 أكتوبر. جلسة حوارية 40 دقيقة مع رئيسَي صندوقين. الفريق يوصي بالقبول.",
      },
    ],
    history: [
      {
        tag: "لينكدإن",
        title: "منشور: تأملات رمضانية في القيادة",
        meta: "اعتُمد 15 يوليو · نُشر 16 يوليو",
        sk: "published",
      },
      {
        tag: "صحافة",
        title: "الشرق بلومبرغ — مقابلة تلفزيونية",
        meta: "قُبلت 8 يوليو · بُثت 18 يوليو",
        sk: "accepted",
      },
      {
        tag: "إكس",
        title: "سلسلة: فلسفة التوظيف",
        meta: "طُلبت تعديلات 6 يوليو · نُشرت 10 يوليو",
        sk: "published",
      },
    ],
    pipeline: [
      { date: "الأحد 26/7", channel: "لينكدإن", title: "بطاقة اقتباس: المواهب والثقافة", sk: "scheduled" },
      {
        date: "الثلاثاء 28/7",
        channel: "إكس",
        title: "سلسلة: نتائج الربع الثاني، القصة خلف الأرقام",
        sk: "inReview",
      },
      { date: "الأربعاء 29/7", channel: "صحافة", title: "بلومبرغ الشرق — موجز المقابلة", sk: "drafting" },
      { date: "الأحد 2/8", channel: "لينكدإن", title: "مقال: لماذا نبني من الرياض", sk: "drafting" },
      {
        date: "الاثنين 10/8",
        channel: "متحدث",
        title: "منتدى مسك العالمي — مخطط الكلمة الرئيسية",
        sk: "drafting",
      },
    ],
    weeks: [
      {
        label: "أسبوع 26 يوليو",
        items: [
          {
            date: "الأحد 26/7",
            channel: "لينكدإن",
            title: "بطاقة اقتباس: المواهب والثقافة",
            sk: "scheduled",
          },
          {
            date: "الثلاثاء 28/7",
            channel: "إكس",
            title: "سلسلة: نتائج الربع الثاني، القصة خلف الأرقام",
            sk: "inReview",
          },
          {
            date: "الأربعاء 29/7",
            channel: "صحافة",
            title: "بلومبرغ الشرق — موجز المقابلة",
            sk: "drafting",
          },
        ],
      },
      {
        label: "أسبوع 2 أغسطس",
        items: [
          { date: "الأحد 2/8", channel: "لينكدإن", title: "مقال: لماذا نبني من الرياض", sk: "drafting" },
          { date: "الأربعاء 5/8", channel: "بودكاست", title: "مجلس المؤسسين — جلسة تسجيل", sk: "scheduled" },
        ],
      },
      {
        label: "أسبوع 9 أغسطس",
        items: [
          {
            date: "الاثنين 10/8",
            channel: "متحدث",
            title: "منتدى مسك العالمي — مخطط الكلمة الرئيسية",
            sk: "drafting",
          },
          {
            date: "الخميس 13/8",
            channel: "لينكدإن",
            title: "ملخص شهري: أبرز أحداث يوليو",
            sk: "drafting",
          },
        ],
      },
    ],
    channels: [
      {
        name: "لينكدإن",
        growth: "+3.1% هذا الشهر",
        followers: "48.2 ألف",
        impressions: "512 ألف",
        engagement: "6.8%",
        posts: "14",
      },
      {
        name: "إكس (تويتر)",
        growth: "+1.9% هذا الشهر",
        followers: "31.5 ألف",
        impressions: "288 ألف",
        engagement: "4.2%",
        posts: "22",
      },
    ],
    topPosts: [
      {
        title: "مقال: لماذا نبني من الرياض (مقتطف)",
        channel: "لينكدإن · 12 يوليو",
        metric: "84 ألف ظهور",
      },
      { title: "سلسلة: دروس من جولتنا التمويلية C", channel: "إكس · 3 يوليو", metric: "51 ألف مشاهدة" },
      {
        title: "مقطع: مقابلة الشرق عن تنظيم التقنية المالية",
        channel: "لينكدإن · 19 يوليو",
        metric: "3.2 ألف تفاعل",
      },
    ],
    press: [
      { date: "18 يوليو", outlet: "بلومبرغ الشرق · تلفزيون ورقمي", title: "مقابلة: عقد التقنية المالية" },
      {
        date: "12 يوليو",
        outlet: "عرب نيوز · أعمال",
        title: "اقتباس في تحليل سوق الاستثمار الجريء السعودي",
      },
      { date: "5 يوليو", outlet: "أرقام", title: "تغطية إعلان الجولة التمويلية C" },
    ],
    roadmap: [
      {
        num: "01",
        name: "التأسيس وتحديد الموقع",
        pct: "100%",
        sk: "complete",
        timeframe: "الربع الأول 2026",
        deliverables: [
          { label: "تدقيق العلامة الشخصية ودراسة الانطباع", done: true },
          { label: "بيت الرسائل وتحديد الموقع", done: true },
          { label: "الهوية البصرية الشخصية والتصوير", done: true },
        ],
      },
      {
        num: "02",
        name: "السردية والصوت",
        pct: "100%",
        sk: "complete",
        timeframe: "الربع الثاني 2026",
        deliverables: [
          { label: "دليل الصوت والنبرة", done: true },
          { label: "تحديد ثلاثة محاور رئيسية", done: true },
          { label: "دليل الكتابة والإيقاع", done: true },
        ],
      },
      {
        num: "03",
        name: "الظهور والإعلام",
        pct: "65%",
        sk: "inProgress",
        timeframe: "الربع الثالث 2026",
        deliverables: [
          { label: "إطلاق برنامج العلاقات الإعلامية", done: true },
          { label: "مقابلتان من الفئة الأولى (بُثت 1 من 2)", done: false },
          { label: "دخول منصات التحدث — مستقبل الاستثمار، مسك", done: false },
        ],
      },
      {
        num: "04",
        name: "الموثوقية والقيادة الفكرية",
        pct: "0%",
        sk: "upcoming",
        timeframe: "الربع الرابع 2026",
        deliverables: [
          { label: "برنامج مقالات رأي شهري", done: false },
          { label: "تأليف تقرير قطاعي", done: false },
          { label: "استكشاف حضور بودكاست وسلسلة خاصة", done: false },
        ],
      },
    ],
    months: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
    days: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  },
};
