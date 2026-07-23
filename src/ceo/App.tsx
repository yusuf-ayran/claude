import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import {
  ListRow,
  Panel,
  ScreenIntro,
  SectionHeader,
  Stat,
  TrendBars,
  Wordmark,
} from "./bits";
import {
  ACCENT,
  BG,
  CHANNEL_TRENDS,
  DATA,
  FONT_AR,
  FONT_EN,
  HAIR_HEAD,
  HAIR_MAJOR,
  INK,
  type Decision,
  type Lang,
  type Screen,
  MUTED,
  PRESENCE_TREND,
  SECONDARY,
  SOFT,
  STATUS_COLORS,
  type Strings,
  T,
} from "./data";

const NOW = new Date(2026, 6, 23); // fixed "today" from the handoff (Thu 23 Jul 2026)

export function CeoApp({
  initialLang = "en",
  initialScreen = "overview",
  clientFirstName = "Faisal",
  presenceScore = 78,
}: {
  initialLang?: Lang;
  initialScreen?: Screen;
  clientFirstName?: string;
  presenceScore?: number;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const isAr = lang === "ar";
  const t = T[lang];
  const d = DATA[lang];
  const font = isAr ? FONT_AR : FONT_EN;

  const decide = (id: string, decision: Decision) =>
    setDecisions((prev) => ({ ...prev, [id]: decision }));

  const pending = d.approvals.filter((a) => !decisions[a.id]);
  const pendingCount = pending.length;

  const dateLine = useMemo(() => {
    const day = d.days[NOW.getDay()];
    const sep = isAr ? "، " : ", ";
    return `${day}${sep}${NOW.getDate()} ${d.months[NOW.getMonth()]} ${NOW.getFullYear()}`;
  }, [d, isAr]);

  let name = clientFirstName;
  if (isAr && name === "Faisal") name = "فيصل";
  const greeting = `${t.goodMorning}${isAr ? "، " : ", "}${name}`;
  const initials = isAr ? "ف ر" : "FA";
  const trend = [...PRESENCE_TREND.slice(0, -1), presenceScore];

  const navItems: { key: Screen; label: string }[] = [
    { key: "overview", label: t.navOverview },
    { key: "approvals", label: t.navApprovals },
    { key: "analytics", label: t.navAnalytics },
    { key: "calendar", label: t.navCalendar },
    { key: "roadmap", label: t.navRoadmap },
  ];

  const langBtn = (active: boolean): CSSProperties => ({
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 1,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "4px 0",
    color: active ? INK : MUTED,
    borderBottom: active ? `1px solid ${ACCENT}` : "1px solid transparent",
  });

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      style={{
        minHeight: "100vh",
        background: BG,
        color: INK,
        fontFamily: font,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ——— header ——— */}
      <header style={{ borderBottom: `1px solid ${HAIR_MAJOR}` }}>
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "20px 32px 0",
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <Wordmark />
          <div
            style={{
              fontSize: 10.5,
              letterSpacing: 3.5,
              textTransform: "uppercase",
              color: MUTED,
              fontWeight: 500,
              paddingTop: 2,
            }}
          >
            {t.portalLabel}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button type="button" onClick={() => setLang("en")} style={langBtn(!isAr)}>
              EN
            </button>
            <button type="button" onClick={() => setLang("ar")} style={langBtn(isAr)}>
              عربي
            </button>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid rgba(232,239,237,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11.5,
              fontWeight: 600,
              color: "#A9BDB9",
            }}
          >
            {initials}
          </div>
        </div>
        <nav
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "14px 32px 0",
            display: "flex",
            gap: 32,
            overflowX: "auto",
          }}
        >
          {navItems.map((n) => {
            const active = screen === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setScreen(n.key)}
                style={{
                  fontFamily: "inherit",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: "0 0 13px",
                  color: active ? INK : MUTED,
                  borderBottom: active ? `2px solid ${ACCENT}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {n.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ——— main ——— */}
      <main
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "48px 32px 80px",
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        {screen === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {/* hero + stat strip */}
            <section style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: MUTED,
                    fontWeight: 500,
                  }}
                >
                  {dateLine}
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 40,
                    lineHeight: 1.1,
                    fontWeight: 300,
                    letterSpacing: "-0.5px",
                    textWrap: "pretty" as CSSProperties["textWrap"],
                  }}
                >
                  {greeting}
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: SECONDARY,
                    maxWidth: "52ch",
                    fontWeight: 400,
                    textWrap: "pretty" as CSSProperties["textWrap"],
                  }}
                >
                  {t.heroSub}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 56,
                  flexWrap: "wrap",
                  borderTop: `1px solid ${HAIR_MAJOR}`,
                  paddingTop: 32,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={labelStyle}>{t.presenceIndex}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <div style={{ fontSize: 60, fontWeight: 300, lineHeight: 0.95, letterSpacing: "-2px" }}>
                      {presenceScore}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>{t.presenceDelta}</div>
                  </div>
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <TrendBars values={trend} width={2} gap={7} maxHeight={64} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={labelStyle}>{t.pendingLabel}</div>
                  <div style={{ fontSize: 60, fontWeight: 300, lineHeight: 0.95, letterSpacing: "-2px" }}>
                    {pendingCount}
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    fontSize: 12,
                    color: MUTED,
                    maxWidth: "26ch",
                    lineHeight: 1.6,
                    paddingBottom: 6,
                    textWrap: "pretty" as CSSProperties["textWrap"],
                  }}
                >
                  {t.presenceNote}
                </div>
              </div>
            </section>

            {/* for your decision */}
            <section style={{ display: "flex", flexDirection: "column" }}>
              <SectionHeader
                title={t.approvalsTitle}
                viewAll={t.viewAll}
                onViewAll={() => setScreen("approvals")}
              />
              {pending.map((item) => (
                <ApprovalRow
                  key={item.id}
                  item={item}
                  strings={t}
                  onApprove={() => decide(item.id, "approved")}
                  onRequestChanges={() => decide(item.id, "changes")}
                />
              ))}
              {pendingCount === 0 && (
                <div
                  style={{
                    padding: "26px 0",
                    fontSize: 13,
                    color: MUTED,
                    borderBottom: `1px solid ${HAIR_MAJOR}`,
                  }}
                >
                  {t.allClear}
                </div>
              )}
            </section>

            {/* pipeline + channels */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
                gap: 64,
                alignItems: "start",
              }}
            >
              <Panel>
                <SectionHeader
                  title={t.pipelineTitle}
                  viewAll={t.viewAll}
                  onViewAll={() => setScreen("calendar")}
                />
                {d.pipeline.map((p, i) => (
                  <ListRow
                    key={i}
                    date={p.date}
                    title={p.title}
                    sub={p.channel}
                    right={t[p.sk]}
                    rightColor={STATUS_COLORS[p.sk]}
                  />
                ))}
              </Panel>
              <Panel>
                <SectionHeader
                  title={t.channelsTitle}
                  viewAll={t.viewAll}
                  onViewAll={() => setScreen("analytics")}
                />
                {d.channels.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 18,
                      padding: "26px 0",
                      borderBottom: `1px solid rgba(232,239,237,0.07)`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}>{c.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{c.growth}</div>
                    </div>
                    <div style={{ display: "flex", gap: 44, flexWrap: "wrap" }}>
                      <Stat value={c.followers} label={t.followers} />
                      <Stat value={c.impressions} label={t.impressions} />
                      <Stat value={c.engagement} label={t.engagement} />
                    </div>
                  </div>
                ))}
              </Panel>
            </section>
          </div>
        )}

        {screen === "approvals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <ScreenIntro title={t.navApprovals} sub={t.approvalsSub} />
            <section style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: `1px solid ${HAIR_HEAD}`, paddingBottom: 14 }}>
                <h2 style={headStyle}>{t.approvalsTitle}</h2>
              </div>
              {d.approvals.map((item) => {
                const dec = decisions[item.id];
                return (
                  <ApprovalRow
                    key={item.id}
                    item={item}
                    strings={t}
                    decided={dec}
                    onApprove={() => decide(item.id, "approved")}
                    onRequestChanges={() => decide(item.id, "changes")}
                  />
                );
              })}
            </section>
            <section style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: `1px solid ${HAIR_HEAD}`, paddingBottom: 14 }}>
                <h2 style={headStyle}>{t.recentDecisions}</h2>
              </div>
              {d.history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 28,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    padding: "20px 0",
                    borderBottom: `1px solid rgba(232,239,237,0.07)`,
                  }}
                >
                  <div style={tagStyle}>{h.tag}</div>
                  <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.4 }}>{h.title}</div>
                    <div style={{ fontSize: 11.5, color: MUTED }}>{h.meta}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: STATUS_COLORS[h.sk],
                    }}
                  >
                    {t[h.sk]}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {screen === "analytics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <ScreenIntro title={t.navAnalytics} sub={t.analyticsSub} />
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
                gap: 64,
                alignItems: "start",
              }}
            >
              {d.channels.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 22,
                    borderTop: `1px solid ${HAIR_HEAD}`,
                    paddingTop: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.2 }}>{c.name}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>{c.growth}</div>
                  </div>
                  <TrendBars values={CHANNEL_TRENDS[i]} width={3} gap={6} maxHeight={72} />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))",
                      gap: 22,
                    }}
                  >
                    <Stat value={c.followers} label={t.followers} size={24} />
                    <Stat value={c.impressions} label={t.impressions} size={24} />
                    <Stat value={c.engagement} label={t.engagement} size={24} />
                    <Stat value={c.posts} label={t.postsMo} size={24} />
                  </div>
                </div>
              ))}
            </section>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
                gap: 64,
                alignItems: "start",
              }}
            >
              <Panel>
                <SectionHeader title={t.topContent} />
                {d.topPosts.map((p, i) => (
                  <ListRow key={i} title={p.title} sub={p.channel} right={p.metric} rightColor={ACCENT} />
                ))}
              </Panel>
              <Panel>
                <SectionHeader title={t.pressCoverage} />
                {d.press.map((p, i) => (
                  <ListRow key={i} date={p.date} title={p.title} sub={p.outlet} />
                ))}
              </Panel>
            </section>
          </div>
        )}

        {screen === "calendar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <ScreenIntro title={t.navCalendar} sub={t.calendarSub} />
            {d.weeks.map((w, i) => (
              <section key={i} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ borderBottom: `1px solid ${HAIR_HEAD}`, paddingBottom: 14 }}>
                  <h2 style={headStyle}>{w.label}</h2>
                </div>
                {w.items.map((p, j) => (
                  <ListRow
                    key={j}
                    date={p.date}
                    dateWidth={100}
                    title={p.title}
                    sub={p.channel}
                    right={t[p.sk]}
                    rightColor={STATUS_COLORS[p.sk]}
                    titleSize={14.5}
                  />
                ))}
              </section>
            ))}
          </div>
        )}

        {screen === "roadmap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
            <ScreenIntro title={t.navRoadmap} sub={t.roadmapSub} />
            {d.roadmap.map((r, i) => (
              <section
                key={i}
                style={{
                  display: "flex",
                  gap: 40,
                  flexWrap: "wrap",
                  borderTop: `1px solid ${HAIR_HEAD}`,
                  padding: "28px 0 8px",
                }}
              >
                <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 2.5, color: MUTED, fontWeight: 600 }}>
                    {r.num} · {r.timeframe}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      textWrap: "pretty" as CSSProperties["textWrap"],
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      color: STATUS_COLORS[r.sk],
                    }}
                  >
                    {t[r.sk]}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ height: 2, background: "rgba(232,239,237,0.1)", maxWidth: 420 }}>
                    <div style={{ height: 2, background: ACCENT, width: r.pct }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {r.deliverables.map((dl, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            flexShrink: 0,
                            background: dl.done ? ACCENT : "rgba(232,239,237,0.25)",
                            marginTop: 6,
                          }}
                        />
                        <div style={{ fontSize: 13.5, color: dl.done ? SOFT : MUTED, lineHeight: 1.6 }}>
                          {dl.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            borderTop: `1px solid ${HAIR_MAJOR}`,
            paddingTop: 24,
          }}
        >
          <div style={{ fontSize: 11.5, color: MUTED }}>{t.footerNote}</div>
          <div style={{ fontSize: 11.5, color: MUTED }}>{t.footerBrand}</div>
        </footer>
      </main>
    </div>
  );
}

// ——— shared inline style fragments ———
const labelStyle: CSSProperties = {
  fontSize: 10.5,
  letterSpacing: 2.5,
  textTransform: "uppercase",
  color: MUTED,
  fontWeight: 500,
};
const headStyle: CSSProperties = {
  margin: 0,
  fontSize: 11,
  letterSpacing: 3,
  textTransform: "uppercase",
  color: INK,
  fontWeight: 600,
};
const tagStyle: CSSProperties = {
  width: 88,
  flexShrink: 0,
  fontSize: 10.5,
  letterSpacing: 2,
  textTransform: "uppercase",
  color: MUTED,
  fontWeight: 600,
};

// An approval row — buttons when pending, a status label once decided.
function ApprovalRow({
  item,
  strings,
  decided,
  onApprove,
  onRequestChanges,
}: {
  item: { tag: string; title: string; excerpt: string; meta: string };
  strings: Strings;
  decided?: Decision;
  onApprove: () => void;
  onRequestChanges: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "26px 0",
        borderBottom: `1px solid ${HAIR_MAJOR}`,
      }}
    >
      <div style={tagStyle}>{item.tag}</div>
      <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.1px" }}>
          {item.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: SECONDARY,
            lineHeight: 1.65,
            maxWidth: "74ch",
            textWrap: "pretty" as CSSProperties["textWrap"],
          }}
        >
          {item.excerpt}
        </div>
        <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{item.meta}</div>
      </div>
      {decided ? (
        <div
          style={{
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 600,
            color: decided === "approved" ? ACCENT : SOFT,
          }}
        >
          {decided === "approved" ? strings.approved : strings.changesRequested}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={onRequestChanges}
            className="ceo-btn-ghost"
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 0.5,
              color: SECONDARY,
              background: "transparent",
              border: "1px solid rgba(232,239,237,0.18)",
              borderRadius: 2,
              padding: "11px 20px",
              cursor: "pointer",
              transition: "border-color 0.15s ease, color 0.15s ease",
            }}
          >
            {strings.requestChanges}
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="ceo-btn-primary"
            style={{
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: BG,
              background: ACCENT,
              border: `1px solid ${ACCENT}`,
              borderRadius: 2,
              padding: "11px 22px",
              cursor: "pointer",
              transition: "background 0.15s ease, border-color 0.15s ease",
            }}
          >
            {strings.approve}
          </button>
        </div>
      )}
    </div>
  );
}
