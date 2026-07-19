// Static content from the design handoff — ship as constants, copied verbatim
// from the prototype's script block.

export const TRACK_NAMES = ["FOOTBALL", "MOVA", "MEDIA", "BUSINESS"] as const;
export type Track = (typeof TRACK_NAMES)[number];

export const CATS = [
  "Football",
  "Recovery",
  "Learning",
  "Content",
  "MOVA Coaching",
  "Relationships",
  "Business Systems",
  "Deep Work",
  "Contribution",
  "Character",
];

export const DAILY = [
  "ONE THING advanced",
  "90-min deep work block",
  "Nutrition targets met",
  "8+ hrs sleep protected",
  "One act of value given",
  "Daily review written",
];

export const RHYTHM = [
  { day: "SUNDAY", name: "Recovery", text: "FULL REST · scorecard · gratitude" },
  { day: "MONDAY", name: "Planning", text: "3 outcomes · block deep work · review the bottleneck" },
  { day: "TUESDAY", name: "Team & Ops", text: "Check-in · clear blockers · batch admin" },
  { day: "WEDNESDAY", name: "Deep Work — Sacred", text: "No meetings · no email · airplane mode" },
  { day: "THURSDAY", name: "Clients", text: "All sessions · max presence · document insights" },
  { day: "FRIDAY", name: "Review", text: "Wins, falls, lessons · energy audit · prep next week" },
  { day: "SATURDAY", name: "Content", text: "Batch filming · schedule the week · repurpose" },
];

export type Milestone = { id: string; label: string; track: Track };
export type Okr = { title: string; krs: string[] };
export type Quarter = {
  id: string;
  end: string;
  label: string;
  bottleneck: string;
  okrs: Okr[];
  milestones: Milestone[];
};
export type YearDef = { year: string; theme: string; targets: string; quarters: Quarter[] };

export const YEARS: YearDef[] = [
  {
    year: "2026",
    theme: "ESTABLISH",
    targets: "$100K revenue · 10 clients · 500 email subs",
    quarters: [
      {
        id: "q326",
        end: "2026-09-30",
        label: "Q3 2026",
        bottleneck: "Sign with a professional club and become indispensable from day one.",
        okrs: [
          {
            title: "Sign with a professional club",
            krs: [
              "Contract signed by end of August 2026",
              "Positive first impression with coaching staff in Week 1",
              "Zero professionalism complaints in first 12 weeks",
            ],
          },
          {
            title: "Launch MOVA coaching to first 5 clients",
            krs: [
              "5 paying clients at $500–800/month",
              "First MOVA session documented as content",
              "Client intake process built and repeatable",
            ],
          },
          {
            title: "Establish content presence",
            krs: [
              "12 pieces published this quarter",
              "Newsletter live — first 100 subscribers",
              "Capture–create–schedule system running",
            ],
          },
        ],
        milestones: [
          { id: "ms1", label: "Professional contract signed", track: "FOOTBALL" },
          { id: "ms2", label: "First 5 paying clients", track: "MOVA" },
          { id: "ms3", label: "Newsletter launched", track: "MEDIA" },
        ],
      },
      {
        id: "q426",
        end: "2026-12-31",
        label: "Q4 2026",
        bottleneck:
          "Deliver consistent match performance and write the first version of the MOVA method.",
        okrs: [
          {
            title: "Establish match performance credibility",
            krs: [
              "Positive coach feedback report by end of November",
              "Match minutes trending upward across the quarter",
              "Recovery protocol operational — no missed sessions",
            ],
          },
          {
            title: "Document MOVA Method v0.1",
            krs: [
              "All 8 components written to first-draft standard",
              "First client transformation story documented",
              "Assessment protocol used with every active client",
            ],
          },
          {
            title: "Grow media presence",
            krs: [
              "20 content pieces this quarter",
              "200+ email subscribers by December",
              "One long-form piece published",
            ],
          },
        ],
        milestones: [
          { id: "ms4", label: "MOVA Method v0.1 written", track: "MOVA" },
          { id: "ms5", label: "First documented transformation", track: "MOVA" },
          { id: "ms6", label: "First $100K year closed", track: "BUSINESS" },
        ],
      },
    ],
  },
  {
    year: "2027",
    theme: "PROVE",
    targets: "$250K revenue · group program live · 2,500 email subs",
    quarters: [
      {
        id: "q127",
        end: "2027-03-31",
        label: "Q1 2027",
        bottleneck:
          "Build a repeatable content system that runs without consuming training energy.",
        okrs: [
          {
            title: "Build repeatable content system",
            krs: [
              "VA managing scheduling fully by end of January",
              "5+ pieces per week with no planning friction",
              "500+ email subscribers by end of March",
            ],
          },
          {
            title: "Method to teachable standard",
            krs: [
              "All 8 components reviewed, in final draft",
              "Group program structure designed and ready",
              "Method shared with 2 trusted coaches for feedback",
            ],
          },
          {
            title: "Build football reputation",
            krs: [
              "Performance metrics trending upward",
              "Proactive agent relationship established",
              "National-team-level awareness growing",
            ],
          },
        ],
        milestones: [{ id: "ms7", label: "Content system fully delegated", track: "MEDIA" }],
      },
      {
        id: "q2327",
        end: "2027-09-30",
        label: "Q2–Q3 2027",
        bottleneck:
          "Document the MOVA method precisely enough that another coach could teach it.",
        okrs: [
          {
            title: "First MOVA group program",
            krs: [
              "8–12 participants in cohort one",
              "3 documented transformation stories",
              "Cohort NPS of 8+/10",
            ],
          },
          {
            title: "Complete MOVA IP documentation",
            krs: [
              "Method document at publishable standard",
              "Certification structure designed",
              "First framework named and legally protected",
            ],
          },
          {
            title: "Scale the media company",
            krs: [
              "2,500+ email subscribers",
              "30,000+ combined social following",
              "10+ long-form YouTube videos live",
            ],
          },
        ],
        milestones: [
          { id: "ms8", label: "First group cohort delivered", track: "MOVA" },
          { id: "ms9", label: "Method v1.0 complete + protected", track: "MOVA" },
          { id: "ms10", label: "$250K revenue year", track: "BUSINESS" },
        ],
      },
    ],
  },
  {
    year: "2028",
    theme: "SCALE",
    targets: "$500K revenue · team of 3+ · 10K email subs",
    quarters: [
      {
        id: "q42728",
        end: "2028-06-30",
        label: "Q4 2027 – Q2 2028",
        bottleneck: "Build the first digital product that removes the personal time ceiling.",
        okrs: [
          {
            title: "Launch first digital product",
            krs: [
              "Validated with 20+ people before building",
              "Live and earning by Q1 2028",
              "First 100 sales within 90 days",
            ],
          },
          {
            title: "Hire first operations person",
            krs: [
              "Role defined before posting",
              "Hired on values first, skills second",
              "Fully operational within 60 days",
            ],
          },
          {
            title: "National team momentum",
            krs: [
              "Live conversations with national team staff",
              "Profile visible to selection decision-makers",
              "Performance metrics at national-team standard",
            ],
          },
        ],
        milestones: [
          { id: "ms11", label: "First digital product launched", track: "MOVA" },
          { id: "ms12", label: "First operations hire", track: "BUSINESS" },
          { id: "ms13", label: "100 product sales", track: "MOVA" },
          { id: "ms14", label: "National team conversations active", track: "FOOTBALL" },
          { id: "ms15", label: "$500K revenue year", track: "BUSINESS" },
        ],
      },
    ],
  },
  {
    year: "2029",
    theme: "IMPACT",
    targets: "$1M revenue · 100+ practitioners · 25K email subs",
    quarters: [
      {
        id: "q3289",
        end: "2029-12-31",
        label: "Q3 2028 – Q4 2029",
        bottleneck: "Write, position, and publish the MOVA book.",
        okrs: [
          {
            title: "Publish the MOVA book",
            krs: [
              "First draft complete by end Q4 2028",
              "Publishing route decided Q1 2029",
              "Launched and in readers’ hands by Q3 2029",
            ],
          },
          {
            title: "Launch Practitioner Certification",
            krs: [
              "Certification curriculum complete",
              "First 20 practitioners trained",
              "Certification an active revenue stream",
            ],
          },
          {
            title: "Reach $1M annual revenue",
            krs: [
              "Target hit and tracked monthly",
              "25,000+ email subscribers",
              "10+ major speaking engagements",
            ],
          },
        ],
        milestones: [
          { id: "ms16", label: "MOVA book published", track: "MOVA" },
          { id: "ms17", label: "First 20 certified practitioners", track: "MOVA" },
          { id: "ms18", label: "10+ major speaking engagements", track: "MEDIA" },
          { id: "ms19", label: "$1M revenue year", track: "BUSINESS" },
        ],
      },
    ],
  },
  {
    year: "2030",
    theme: "LEGACY",
    targets: "$2.5M+ · 500+ practitioners · 20+ countries · Foundation",
    quarters: [
      {
        id: "y2030",
        end: "2030-12-31",
        label: "2030",
        bottleneck:
          "Operate companies at scale while competing at the highest level of football.",
        okrs: [
          {
            title: "Compete at the highest level",
            krs: [
              "Career extended through body maintenance programme",
              "National team active participation",
              "Football as living proof of the method",
            ],
          },
          {
            title: "MOVA as a global brand",
            krs: [
              "500+ practitioners in 20+ countries",
              "$2.5M+ revenue with team of 10+",
              "Passive income covers personal expenses",
            ],
          },
          {
            title: "Launch the MOVA Foundation",
            krs: [
              "Foundation legally established",
              "First programme serving underserved youth",
              "Annual impact report published",
            ],
          },
        ],
        milestones: [
          { id: "ms20", label: "500+ practitioners, 20+ countries", track: "MOVA" },
          { id: "ms21", label: "MOVA Foundation launched", track: "BUSINESS" },
          { id: "ms22", label: "$2.5M+ revenue, passive covers life", track: "BUSINESS" },
        ],
      },
    ],
  },
];

// Journey range: 2026-07-01 -> 2030-12-31 inclusive.
export const JOURNEY_START = "2026-07-01";
export const JOURNEY_END = "2030-12-31";
