import { useState, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERESTS = [
  "Travel","Fitness","Reading","Cooking","Music",
  "Art","Tech","Nature","Mindfulness","Career",
  "Social","Finance","Photography","Gaming","Writing","Health"
];

const CAT_COLORS = {
  Travel:"#FF6B6B", Fitness:"#4ECDC4", Reading:"#45B7D1",
  Cooking:"#FFA07A", Music:"#C084FC", Art:"#FB923C",
  Tech:"#34D399", Nature:"#4ADE80", Mindfulness:"#FBBF24",
  Career:"#60A5FA", Social:"#F472B6", Finance:"#2DD4BF",
  Photography:"#A78BFA", Gaming:"#38BDF8", Writing:"#FB7185",
  Health:"#86EFAC", default:"#FF6B6B"
};

const PERIODS = [
  { id:"day",   label:"Day",      full:"5 a Day",       emoji:"☀️", desc:"Today",      color:"#FF6B6B" },
  { id:"month", label:"Month",    full:"5 a Month",     emoji:"🗓️", desc:"This Month", color:"#60A5FA" },
  { id:"sixmo", label:"6 Months", full:"5 a Half-Year", emoji:"🌿", desc:"6 Months",   color:"#34D399" },
  { id:"year",  label:"Year",     full:"5 a Year",      emoji:"🏆", desc:"This Year",  color:"#FBBF24" },
];

const NAV = [
  { id:"today",    icon:"☀️", label:"Today"    },
  { id:"history",  icon:"📖", label:"History"  },
  { id:"progress", icon:"📊", label:"Progress" },
  { id:"profile",  icon:"⊙",  label:"Profile"  },
];

// Time commitment tiers — per-item minutes = total / 5
const TIME_TIERS = [
  { mins: 15, label: "15 min",  desc: "Super quick",   emoji: "⚡", sub: "~3 min each",  color: "#4ADE80" },
  { mins: 30, label: "30 min",  desc: "Half hour",     emoji: "☀️", sub: "~6 min each",  color: "#60A5FA" },
  { mins: 45, label: "45 min",  desc: "Good session",  emoji: "🌿", sub: "~9 min each",  color: "#C084FC" },
  { mins: 60, label: "60 min",  desc: "Full hour",     emoji: "🏆", sub: "~12 min each", color: "#FBBF24" },
];

const AGE_GROUPS = [
  { id:"18-25", label:"18–25", emoji:"🚀", desc:"Just getting started", color:"#60A5FA" },
  { id:"26-35", label:"26–35", emoji:"⚡", desc:"Building & exploring",  color:"#4ECDC4" },
  { id:"36-50", label:"36–50", emoji:"🌿", desc:"Deepening & growing",   color:"#4ADE80" },
  { id:"51+",   label:"51+",   emoji:"🏆", desc:"Wisdom & legacy",       color:"#FBBF24" },
];

// Sample data keyed by time budget (mins per item)
const SAMPLE_DAY = {
  15: [
    { id:"d1", cat:"Mindfulness", text:"Close your eyes for 3 minutes and focus only on your breathing. Nothing else.",      tag:"3 min",  link:"https://www.youtube.com/watch?v=inpok4MKVLM", linkLabel:"3-min meditation on YouTube" },
    { id:"d2", cat:"Reading",     text:"Read 2 pages of any book — just 2. Build the habit before the volume.",               tag:"3 min",  link:"https://www.blinkist.com", linkLabel:"Get book summaries on Blinkist" },
    { id:"d3", cat:"Fitness",     text:"Do 20 jumping jacks, 10 push-ups, and 10 squats. That's it.",                         tag:"3 min",  link:"https://www.youtube.com/watch?v=8RNMELKhBBw", linkLabel:"Quick home workout" },
    { id:"d4", cat:"Social",      text:"Send one genuine compliment or check-in message to someone you care about.",           tag:"2 min",  link:"https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk", linkLabel:"School of Greatness podcast" },
    { id:"d5", cat:"Nature",      text:"Step outside, take 5 deep breaths of fresh air, notice what's around you.",           tag:"3 min",  link:"https://www.alltrails.com", linkLabel:"Find a trail on AllTrails" },
  ],
  30: [
    { id:"d1", cat:"Mindfulness", text:"Do a guided 5-minute box breathing session to reset your focus and nervous system.",   tag:"5 min",  link:"https://www.youtube.com/watch?v=tEmt1Znux58", linkLabel:"Box breathing on YouTube" },
    { id:"d2", cat:"Reading",     text:"Read 5 pages of a book you've been meaning to start. Just 5 — no pressure to do more.",tag:"8 min",  link:"https://www.goodreads.com/list/show/1.Best_Books_Ever", linkLabel:"Find a book on Goodreads" },
    { id:"d3", cat:"Fitness",     text:"Complete a quick 7-minute bodyweight workout — no equipment, no excuses.",             tag:"7 min",  link:"https://www.youtube.com/watch?v=ECxYJcnvyMw", linkLabel:"7-min workout on YouTube" },
    { id:"d4", cat:"Social",      text:"Send a voice note or message to someone you've been meaning to catch up with.",        tag:"5 min",  link:"https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk", linkLabel:"School of Greatness podcast" },
    { id:"d5", cat:"Nature",      text:"Take a 5-minute walk outside. Leave your phone in your pocket and just observe.",      tag:"5 min",  link:"https://www.alltrails.com", linkLabel:"Find a trail on AllTrails" },
  ],
  45: [
    { id:"d1", cat:"Mindfulness", text:"Follow a 10-minute guided meditation to set a clear intention for the day.",           tag:"10 min", link:"https://www.youtube.com/watch?v=O-6f5wQXSu8", linkLabel:"10-min meditation on YouTube" },
    { id:"d2", cat:"Reading",     text:"Read 10 pages of a book — enough to really get into it and feel the progress.",        tag:"10 min", link:"https://www.goodreads.com/list/show/1.Best_Books_Ever", linkLabel:"Find a book on Goodreads" },
    { id:"d3", cat:"Fitness",     text:"Do a 10-minute yoga flow or stretching session to loosen your body and mind.",         tag:"10 min", link:"https://www.youtube.com/watch?v=v7AYKMP6rOE", linkLabel:"10-min yoga flow on YouTube" },
    { id:"d4", cat:"Social",      text:"Call (not text) someone you haven't spoken to in a while. Just to say hi.",            tag:"8 min",  link:"https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk", linkLabel:"School of Greatness podcast" },
    { id:"d5", cat:"Nature",      text:"Go for a brisk 10-minute walk. Deliberately notice 3 things you've never seen before.",tag:"10 min", link:"https://www.alltrails.com", linkLabel:"Find a trail on AllTrails" },
  ],
  60: [
    { id:"d1", cat:"Mindfulness", text:"Do a 15-minute journaling session — write about what you're grateful for and one intention.",     tag:"15 min", link:"https://www.youtube.com/watch?v=TIDMzFEZBec", linkLabel:"Guided journaling on YouTube" },
    { id:"d2", cat:"Reading",     text:"Read for 15 minutes — a full chapter. No phone nearby.",                                          tag:"15 min", link:"https://www.goodreads.com/list/show/1.Best_Books_Ever", linkLabel:"Find a book on Goodreads" },
    { id:"d3", cat:"Fitness",     text:"Complete a full 15-minute HIIT or strength training workout from YouTube.",                        tag:"15 min", link:"https://www.youtube.com/watch?v=ml6cT4AZdqI", linkLabel:"15-min HIIT on YouTube" },
    { id:"d4", cat:"Social",      text:"Have a proper 10-minute phone or video call with a friend or family member.",                      tag:"10 min", link:"https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk", linkLabel:"School of Greatness podcast" },
    { id:"d5", cat:"Nature",      text:"Take a 15-minute walk in a park or green space. Leave headphones at home.",                        tag:"15 min", link:"https://www.alltrails.com", linkLabel:"Find a trail on AllTrails" },
  ],
};

const SAMPLE_OTHER = {
  month: [
    { id:"m1", cat:"Photography", text:"Start a 30-day colour challenge — photograph one dominant colour theme each day.", tag:"Ongoing",  link:"https://www.instagram.com/explore/tags/30dayphotochallenge/", linkLabel:"See examples on Instagram" },
    { id:"m2", cat:"Finance",     text:"Review last month's spending and identify one category to cut back on.",           tag:"1–2 hrs",  link:"https://www.moneysavingexpert.com/banking/budget-planning-free-spreadsheet/", linkLabel:"Free budget template" },
    { id:"m3", cat:"Travel",      text:"Research and book a day trip somewhere within 2 hours. Do it this month.",         tag:"Plan now", link:"https://www.tripadvisor.com", linkLabel:"Discover on TripAdvisor" },
    { id:"m4", cat:"Writing",     text:"Write a short essay about one belief you've changed your mind about.",             tag:"1–2 hrs",  link:"https://750words.com", linkLabel:"Write on 750words.com" },
    { id:"m5", cat:"Tech",        text:"Automate one repetitive task — a reminder, an email filter, a bill payment.",      tag:"Varies",   link:"https://zapier.com/blog/best-zapier-automations/", linkLabel:"Automation ideas on Zapier" },
  ],
  sixmo: [
    { id:"s1", cat:"Fitness",  text:"Start the NHS Couch to 5K programme. Week 1, Run 1 is just 20 minutes.",             tag:"6 months", link:"https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/get-running-with-couch-to-5k/", linkLabel:"NHS Couch to 5K" },
    { id:"s2", cat:"Career",   text:"Complete one online certification that moves you toward your ideal role.",            tag:"Ongoing",  link:"https://www.coursera.org", linkLabel:"Browse courses on Coursera" },
    { id:"s3", cat:"Travel",   text:"Plan and book the international trip you've been talking about for years.",           tag:"Big goal", link:"https://www.skyscanner.net", linkLabel:"Search flights on Skyscanner" },
    { id:"s4", cat:"Music",    text:"Learn to play 5 complete songs on any instrument over the next 6 months.",           tag:"Ongoing",  link:"https://www.yousician.com", linkLabel:"Learn with Yousician" },
    { id:"s5", cat:"Writing",  text:"Write a short story or personal memoir of at least 5,000 words.",                    tag:"Ongoing",  link:"https://nanowrimo.org", linkLabel:"Join NaNoWriMo" },
  ],
  year: [
    { id:"y1", cat:"Reading", text:"Read 24 books this year — 2 per month. Alternate fiction and non-fiction.",           tag:"Year goal", link:"https://www.goodreads.com/challenges/show/11621", linkLabel:"Join Goodreads Challenge" },
    { id:"y2", cat:"Fitness", text:"Train for and complete a half marathon. Find a local race and sign up today.",         tag:"Year goal", link:"https://www.runnersworld.com/uk/training/half-marathon/", linkLabel:"Half marathon plans" },
    { id:"y3", cat:"Travel",  text:"Visit 3 countries you've never been to. Start with research and a savings target.",   tag:"Year goal", link:"https://www.nomadicmatt.com", linkLabel:"Inspiration at Nomadic Matt" },
    { id:"y4", cat:"Career",  text:"Launch a side project or portfolio that showcases your skills and ships something.",   tag:"Year goal", link:"https://www.producthunt.com", linkLabel:"Get inspired on Product Hunt" },
    { id:"y5", cat:"Art",     text:"Complete one creative piece every month — photo series, painting, short film.",        tag:"Year goal", link:"https://www.skillshare.com", linkLabel:"Learn a new art form on Skillshare" },
  ],
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const load = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const save = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const todayKey = () => new Date().toISOString().slice(0,10);
const monthKey = () => new Date().toISOString().slice(0,7);

// ─── Discovery Card ──────────────────────────────────────────────────────────

const FALLBACK_DISCOVERIES = [
  { text:"Gyokuro is Japan's most prized green tea — shaded for 3 weeks before harvest, giving it a deep umami sweetness unlike anything you've tasted. Brew it at 50°C for 90 seconds.", cat:"Rare Tea", emoji:"🍵", link:"https://www.postcard-teas.com/gyokuro", linkLabel:"Buy from Postcard Teas" },
  { text:"Spoon carving is a 20-minute-a-day wooden spoon craft that Nordic countries call 'slöjd'. All you need is a penknife and a bit of birchwood. Deeply meditative.", cat:"Micro-hobby", emoji:"🪵", link:"https://www.youtube.com/watch?v=0GDd2CCtK5s", linkLabel:"Learn on YouTube" },
  { text:"Sichuan mala hotpot broth has a unique 'numbing spice' from Sichuan peppercorns — not just heat, but a tingly, electric sensation on your tongue. Try making it at home.", cat:"Street Food", emoji:"🌶️", link:"https://www.seriouseats.com/sichuan-hot-pot", linkLabel:"Recipe on Serious Eats" },
  { text:"Kintsugi is the Japanese art of repairing broken pottery with gold, making the cracks the most beautiful part. A starter kit costs about £15 and the philosophy is life-changing.", cat:"Japanese Art", emoji:"🏺", link:"https://www.amazon.co.uk/s?k=kintsugi+kit", linkLabel:"Find a kit on Amazon" },
  { text:"Smriti is a Sanskrit word meaning 'that which is remembered' — specifically the kind of knowledge passed down through oral tradition. No equivalent in English.", cat:"Weird Fact", emoji:"💡", link:"https://en.wikipedia.org/wiki/Smriti", linkLabel:"Explore on Wikipedia" },
];

const DiscoveryCard = ({ discovery, done, onToggle, onRefresh, loading, error }) => {
  const d = discovery || FALLBACK_DISCOVERIES[Math.floor(Date.now()/86400000) % FALLBACK_DISCOVERIES.length];
  const GOLD = "#F59E0B";
  const handleLink = (e) => { e.stopPropagation(); if (d.link) window.open(d.link, "_blank", "noopener"); };

  return (
    <div style={{marginBottom:"12px",animation:"fadeUp 0.4s ease 0.42s both"}}>
      {/* Header row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
          <span style={{fontSize:"11px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",color:GOLD}}>✦ Today's Discovery</span>
        </div>
        <button onClick={onRefresh} disabled={loading} style={{
          background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.25)",
          borderRadius:"10px",padding:"4px 10px",color:GOLD,
          fontSize:"11px",fontWeight:"600",cursor:loading?"not-allowed":"pointer",
          fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"5px",
          opacity:loading?0.5:1,transition:"all 0.2s",
        }}>
          {loading
            ? <><span style={{width:"8px",height:"8px",border:"1.5px solid "+GOLD,borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Finding...</>
            : "↺ New one"}
        </button>
      </div>

      {error && (
        <div style={{background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.2)",borderRadius:"12px",padding:"9px 14px",marginBottom:"10px",fontSize:"12px",color:"rgba(255,120,120,0.85)"}}>
          ⚠️ {error}
        </div>
      )}
      {/* Card */}
      <div style={{
        background:done?"rgba(245,158,11,0.03)":"rgba(245,158,11,0.07)",
        border:`1px solid ${done?"rgba(245,158,11,0.12)":"rgba(245,158,11,0.28)"}`,
        borderRadius:"20px",overflow:"hidden",
        boxShadow:done?"none":"0 0 30px rgba(245,158,11,0.06)",
        transition:"all 0.25s",opacity:done?0.6:1,
      }}>
        {/* Main content */}
        <div onClick={()=>onToggle()} style={{padding:"18px 18px 14px 16px",display:"flex",gap:"14px",alignItems:"flex-start",cursor:"pointer"}}>
          {/* Checkbox */}
          <div style={{
            width:"28px",height:"28px",borderRadius:"50%",flexShrink:0,
            border:`2px solid ${done?GOLD:"rgba(245,158,11,0.4)"}`,
            background:done?GOLD:"transparent",
            display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all 0.25s",marginTop:"2px",
          }}>
            {done && <span style={{color:"#fff",fontSize:"13px",fontWeight:"700"}}>✓</span>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            {/* Category + emoji badge */}
            <div style={{display:"flex",gap:"6px",marginBottom:"8px",alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontSize:"18px",lineHeight:1}}>{d.emoji}</span>
              <span style={{
                background:"rgba(245,158,11,0.15)",color:GOLD,
                fontSize:"10px",fontWeight:"700",letterSpacing:"0.8px",
                textTransform:"uppercase",padding:"2px 8px",borderRadius:"6px",
              }}>{d.cat}</span>
              <span style={{
                background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.3)",
                fontSize:"10px",padding:"2px 8px",borderRadius:"6px",
              }}>bonus</span>
            </div>
            <p style={{
              color:done?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.88)",
              fontSize:"14px",lineHeight:"1.6",margin:0,
              fontFamily:"'DM Sans',sans-serif",
              textDecoration:done?"line-through":"none",
            }}>{d.text}</p>
          </div>
        </div>
        {/* Link row */}
        {d.link && (
          <div onClick={handleLink} style={{
            borderTop:"1px solid rgba(245,158,11,0.12)",padding:"10px 18px 12px",
            display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",
            background:"rgba(245,158,11,0.03)",
          }}>
            <div style={{width:"18px",height:"18px",borderRadius:"5px",flexShrink:0,background:"rgba(245,158,11,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:"9px",color:GOLD}}>↗</span>
            </div>
            <span style={{fontSize:"12px",color:GOLD,fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{d.linkLabel||d.link}</span>
            <span style={{fontSize:"10px",color:"rgba(245,158,11,0.3)",flexShrink:0}}>tap to open</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Chip = ({ label, selected, onToggle }) => (
  <button onClick={() => onToggle(label)} style={{
    background: selected ? (CAT_COLORS[label]||"#FF6B6B") : "rgba(255,255,255,0.07)",
    color: selected ? "#fff" : "rgba(255,255,255,0.55)",
    border: `1px solid ${selected ? "transparent" : "rgba(255,255,255,0.12)"}`,
    borderRadius:"20px", padding:"7px 15px", fontSize:"13px",
    fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
    transition:"all 0.2s", fontWeight: selected?"600":"400",
  }}>{label}</button>
);

// Time tier picker tile
const TimeTile = ({ tier, selected, onSelect }) => (
  <button onClick={() => onSelect(tier.mins)} style={{
    flex:1, padding:"16px 8px", borderRadius:"16px", border:"none",
    background: selected ? `${tier.color}18` : "rgba(255,255,255,0.05)",
    outline: selected ? `2px solid ${tier.color}` : "2px solid transparent",
    cursor:"pointer", transition:"all 0.2s", display:"flex",
    flexDirection:"column", alignItems:"center", gap:"5px",
  }}>
    <span style={{fontSize:"22px"}}>{tier.emoji}</span>
    <span style={{color: selected ? tier.color : "#fff", fontSize:"14px", fontWeight:"700", fontFamily:"'DM Sans',sans-serif"}}>{tier.label}</span>
    <span style={{color: selected ? tier.color : "rgba(255,255,255,0.4)", fontSize:"11px", fontFamily:"'DM Sans',sans-serif"}}>{tier.desc}</span>
    <span style={{
      color: selected ? tier.color : "rgba(255,255,255,0.25)",
      fontSize:"10px", fontFamily:"'DM Sans',sans-serif",
      background: selected ? `${tier.color}18` : "rgba(255,255,255,0.05)",
      padding:"2px 7px", borderRadius:"8px", marginTop:"2px",
    }}>{tier.sub}</span>
  </button>
);

const Card = ({ item, done, onToggle, idx }) => {
  const color = CAT_COLORS[item.cat] || CAT_COLORS.default;
  const handleLink = (e) => { e.stopPropagation(); if (item.link) window.open(item.link, "_blank", "noopener"); };
  return (
    <div style={{
      background: done ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.065)",
      border:`1px solid ${done?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.11)"}`,
      borderRadius:"20px", marginBottom:"12px",
      transition:"all 0.25s", opacity:done?0.55:1,
      animation:`fadeUp 0.4s ease ${idx*0.07}s both`, overflow:"hidden",
    }}>
      <div onClick={() => onToggle(item.id)} style={{padding:"18px 18px 14px 16px", display:"flex", gap:"14px", alignItems:"flex-start", cursor:"pointer"}}>
        <div style={{
          width:"28px",height:"28px",borderRadius:"50%",flexShrink:0,
          border:`2px solid ${done?color:"rgba(255,255,255,0.22)"}`,
          background:done?color:"transparent",
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"all 0.25s",marginTop:"2px",
        }}>
          {done && <span style={{color:"#fff",fontSize:"13px",fontWeight:"700"}}>✓</span>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:"6px",marginBottom:"7px",flexWrap:"wrap",alignItems:"center"}}>
            <span style={{background:`${color}22`,color,fontSize:"10px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",padding:"2px 8px",borderRadius:"6px"}}>{item.cat}</span>
            <span style={{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.38)",fontSize:"10px",padding:"2px 8px",borderRadius:"6px"}}>{item.tag}</span>
          </div>
          <p style={{color:done?"rgba(255,255,255,0.32)":"rgba(255,255,255,0.88)",fontSize:"14px",lineHeight:"1.55",margin:0,fontFamily:"'DM Sans',sans-serif",textDecoration:done?"line-through":"none"}}>{item.text}</p>
        </div>
      </div>
      {item.link && (
        <div onClick={handleLink} style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"10px 18px 12px",display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",background:"rgba(255,255,255,0.02)"}}>
          <div style={{width:"18px",height:"18px",borderRadius:"5px",flexShrink:0,background:`${color}22`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:"9px"}}>↗</span>
          </div>
          <span style={{fontSize:"12px",color,fontWeight:"500",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{item.linkLabel||item.link}</span>
          <span style={{fontSize:"10px",color:"rgba(255,255,255,0.2)",flexShrink:0}}>tap to open</span>
        </div>
      )}
    </div>
  );
};

const StreakBadge = ({ streak }) => (
  <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:"20px",padding:"5px 12px"}}>
    <span style={{fontSize:"14px"}}>🔥</span>
    <span style={{color:"#FBBF24",fontSize:"13px",fontWeight:"700"}}>{streak} day streak</span>
  </div>
);

const TimeBudget = ({ items, budget, doneKeyFn }) => {
  const doneMins = items.reduce((acc, item) => doneKeyFn(item.id) ? acc + (parseInt(item.tag)||0) : acc, 0);
  const totalMins = items.reduce((acc, item) => acc + (parseInt(item.tag)||0), 0);
  if (!totalMins) return null;
  const pct = budget > 0 ? Math.min(doneMins / budget, 1) : 0;
  const tier = TIME_TIERS.find(t => t.mins === budget) || TIME_TIERS[1];
  return (
    <div style={{marginBottom:"16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"14px",padding:"12px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
          <span style={{fontSize:"13px"}}>{tier.emoji}</span>
          <span style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.5px",fontWeight:"600"}}>TODAY'S BUDGET</span>
        </div>
        <span style={{fontSize:"12px",color:tier.color,fontWeight:"700"}}>{doneMins} / {budget} min</span>
      </div>
      <div style={{height:"5px",background:"rgba(255,255,255,0.06)",borderRadius:"3px",overflow:"hidden",marginBottom:"7px"}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:`linear-gradient(90deg,${tier.color},#FF8E53)`,borderRadius:"3px",transition:"width 0.4s ease"}}/>
      </div>
      <p style={{fontSize:"11px",color:"rgba(255,255,255,0.22)",margin:0}}>
        {tier.desc} · {tier.sub} · {budget === 15 ? "perfect micro-habit" : budget === 30 ? "fits in a lunch break" : budget === 45 ? "a solid daily ritual" : "a full power hour"} ☀️
      </p>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [interests,    setInterests]    = useState(() => load("fad_interests", []));
  const [timeBudget,   setTimeBudget]   = useState(() => load("fad_time_budget", 30));
  const [ageGroup,     setAgeGroup]     = useState(() => load("fad_age_group", ""));
  const [userLocation, setUserLocation] = useState(() => load("fad_location", null)); // {city, country, lat, lng}
  const [doneMap,      setDoneMap]      = useState(() => load("fad_done", {}));
  const [aiCache,      setAiCache]      = useState(() => load("fad_ai_cache", {}));
  const [history,      setHistory]      = useState(() => load("fad_history", []));
  const [streak,       setStreak]       = useState(() => load("fad_streak", 0));
  const [lastActive,   setLastActive]   = useState(() => load("fad_last_active", ""));
  const [notifTime,    setNotifTime]    = useState(() => load("fad_notif_time", "08:00"));
  const [notifOn,      setNotifOn]      = useState(() => load("fad_notif_on", false));

  // onboard has 2 steps: "interests" then "time"
  const hasSetup = interests.length > 0 && timeBudget && ageGroup;
  const [screen,        setScreen]        = useState(hasSetup ? "app" : "onboard");
  const [onboardStep,   setOnboardStep]   = useState("interests"); // "interests" | "time" | "profile"
  const [nav,           setNav]           = useState("today");
  const [activePeriod,  setActivePeriod]  = useState("day");
  const [aiLoading,     setAiLoading]     = useState(false);
  const [editInterests, setEditInterests] = useState(false);
  const [editTime,      setEditTime]      = useState(false);
  const [tempInterests, setTempInterests] = useState([]);
  const [tempTime,      setTempTime]      = useState(30);
  const [notifBanner,   setNotifBanner]   = useState("");
  const [discovery,     setDiscovery]     = useState(() => load("fad_discovery", null));      // {text, cat, link, linkLabel, emoji}
  const [discDone,      setDiscDone]      = useState(() => load("fad_disc_done", {}));         // {date: bool}
  const [discLoading,   setDiscLoading]   = useState(false);
  const [discError,     setDiscError]     = useState("");
  const [aiError,       setAiError]       = useState("");

  useEffect(() => { save("fad_interests",    interests);  }, [interests]);
  useEffect(() => { save("fad_time_budget",  timeBudget); }, [timeBudget]);
  useEffect(() => { save("fad_age_group",    ageGroup);   }, [ageGroup]);
  useEffect(() => { save("fad_location",     userLocation);}, [userLocation]);
  useEffect(() => { save("fad_done",         doneMap);    }, [doneMap]);
  useEffect(() => { save("fad_ai_cache",     aiCache);    }, [aiCache]);
  useEffect(() => { save("fad_history",      history);    }, [history]);
  useEffect(() => { save("fad_streak",       streak);     }, [streak]);
  useEffect(() => { save("fad_last_active",  lastActive); }, [lastActive]);
  useEffect(() => { save("fad_notif_time",   notifTime);  }, [notifTime]);
  useEffect(() => { save("fad_notif_on",     notifOn);    }, [notifOn]);
  useEffect(() => { save("fad_discovery",    discovery);  }, [discovery]);
  useEffect(() => { save("fad_disc_done",    discDone);   }, [discDone]);

  useEffect(() => {
    const today = todayKey();
    if (lastActive && lastActive !== today) {
      if ((new Date(today) - new Date(lastActive)) / 86400000 > 1) { setStreak(0); save("fad_streak",0); }
    }
  }, []);

  const periodStorageKey = (p) => {
    if (p==="day")   return todayKey();
    if (p==="month") return monthKey();
    if (p==="sixmo") return new Date().getFullYear()+"-H"+(new Date().getMonth()<6?"1":"2");
    return String(new Date().getFullYear());
  };

  const doneKey  = (period, itemId) => `${periodStorageKey(period)}_${period}_${itemId}`;
  const cacheKey = (period) => `${[...interests].sort().join(",")}::${period}::${timeBudget}::${ageGroup}::${userLocation?.city||""}`;

  const getSuggestions = (period) => {
    const cached = aiCache[cacheKey(period)];
    if (cached) return cached;
    if (period === "day") return SAMPLE_DAY[timeBudget] || SAMPLE_DAY[30];
    return SAMPLE_OTHER[period] || [];
  };

  const isDone    = (itemId) => !!doneMap[doneKey(activePeriod, itemId)];
  const doneCount = () => getSuggestions(activePeriod).filter(i => isDone(i.id)).length;

  const toggleDone = (itemId) => {
    const k = doneKey(activePeriod, itemId);
    const newDone = { ...doneMap, [k]: !doneMap[k] };
    setDoneMap(newDone);
    save("fad_done", newDone);
    if (activePeriod === "day") {
      const today = todayKey();
      const items = getSuggestions("day");
      const count = items.filter(i => newDone[doneKey("day", i.id)]).length;
      const newHistory = [...history];
      const idx = newHistory.findIndex(h => h.date===today && h.period==="day");
      if (idx >= 0) newHistory[idx] = {...newHistory[idx], count};
      else newHistory.push({date:today, period:"day", count, total:items.length, budget:timeBudget});
      setHistory(newHistory);
      save("fad_history", newHistory);
      if (count === items.length && lastActive !== today) {
        const ns = streak+1; setStreak(ns); setLastActive(today);
        save("fad_streak",ns); save("fad_last_active",today);
      }
    }
  };

  // ── AI Refresh ────────────────────────────────────────────────────────────
  const refreshAI = async () => {
    setAiLoading(true);
    setAiError("");
    const period = PERIODS.find(p=>p.id===activePeriod);
    const isDay  = activePeriod === "day";
    const perItem = isDay ? Math.round(timeBudget / 5) : null;
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:2000,
          system:`You are a life enrichment assistant. Respond ONLY with a valid JSON array — no markdown, no preamble, no explanation.`,
          messages:[{role:"user", content:`Generate exactly 5 specific, fresh, inspiring suggestions for this person. Make them DIFFERENT from generic advice — be creative and specific.

Interests: ${interests.join(", ")}
Age group: ${ageGroup || "not specified"}
Location: ${userLocation ? `${userLocation.city}, ${userLocation.country}` : "not provided"}
Time period: ${period?.full}
${isDay ? `Time budget: ${timeBudget} minutes total. Each item must take ~${perItem} minutes.` : ""}

${ageGroup === "18-25" ? "Age context: early career, social, affordable, skill-building" : ""}
${ageGroup === "26-35" ? "Age context: career growth, fitness, travel, building habits" : ""}
${ageGroup === "36-50" ? "Age context: health, meaningful experiences, deeper mastery" : ""}
${ageGroup === "51+" ? "Age context: mindfulness, gentler fitness, cultural, legacy" : ""}
${userLocation ? `Location context: suggest things relevant to or near ${userLocation.city} where possible` : ""}

For each suggestion include a REAL link — a specific YouTube video URL, a well-known website, or a popular app. Use real URLs you know exist (YouTube, Spotify, Goodreads, AllTrails, Coursera, NHS, etc).

Return ONLY this JSON array (5 items, no outer object):
[{"id":"ai1","cat":"InterestName","text":"specific suggestion (2 sentences)","tag":"${isDay ? `${perItem} min` : "time needed"}","link":"https://real-url.com","linkLabel":"Short link label"}]`}]
        })
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error?.message || `API error ${resp.status}`);
      }
      const data = await resp.json();
      const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(text);
      // Always overwrite cache with fresh results
      const ck = cacheKey(activePeriod) + "::" + Date.now();
      const nc = {...aiCache, [cacheKey(activePeriod)]:parsed};
      setAiCache(nc); save("fad_ai_cache",nc);
    } catch(e) {
      console.error("AI error:", e);
      setAiError(e.message || "Something went wrong. Try again.");
    }
    setAiLoading(false);
  };


  // ── Discovery Refresh ─────────────────────────────────────────────────────
  const refreshDiscovery = async () => {
    setDiscLoading(true);
    setDiscError("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access":"true",
        },
        body:JSON.stringify({
          model:"claude-haiku-4-5-20251001",
          max_tokens:800,
          system:`You are a curiosity curator. You suggest one genuinely surprising, delightful discovery — something new to try, taste, buy, watch, or experience. It must be specific, real, and come from a completely unexpected field. Respond ONLY with valid JSON, no markdown.`,
          messages:[{role:"user", content:`Suggest one genuinely surprising and delightful discovery for someone aged ${ageGroup}${userLocation ? ` in ${userLocation.city}, ${userLocation.country}` : ""}.

Their usual interests are: ${interests.join(", ")} — so pick something from OUTSIDE these areas to expand their world.

It could be: a specific tea or drink, an obscure food dish, a weird product under £30, a micro-hobby, a fascinating documentary, a word in another language with no English equivalent, a local independent shop or market${userLocation ? ` near ${userLocation.city}` : ""}, an unusual sport to watch, a forgotten craft, a strange fact with a rabbit hole to explore — anything genuinely surprising.

Return ONLY this JSON object (not an array):
{
  "text": "One specific, vivid, enticing description of what this is and why it's worth trying (2-3 sentences)",
  "cat": "short category label (e.g. 'Rare Tea', 'Micro-hobby', 'Street Food', 'Weird Fact', 'Local Find')",
  "emoji": "one perfect emoji for it",
  "link": "https://real-url.com/specific-page",
  "linkLabel": "Short label — e.g. 'Buy on Etsy', 'Watch on YouTube', 'Find near you'"
}`}]
        })
      });
      const data = await resp.json();
      const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(text);
      setDiscovery(parsed);
      save("fad_discovery", parsed);
    } catch(e) { console.error(e); setDiscError("Couldn't load a discovery right now. Try again!"); }
    setDiscLoading(false);
  };

  // ── Notifications ─────────────────────────────────────────────────────────
  const requestNotifications = async () => {
    if (!("Notification" in window)) { setNotifBanner("Not supported in this browser."); return; }
    const perm = await Notification.requestPermission();
    if (perm==="granted") {
      setNotifOn(true); save("fad_notif_on",true);
      new Notification("Five a Day 🌅",{body:"Reminders on! Nudging you at "+notifTime});
      setNotifBanner("Notifications enabled ✓");
    } else setNotifBanner("Permission denied — enable in browser settings.");
    setTimeout(()=>setNotifBanner(""),3500);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCompleted = Object.values(doneMap).filter(Boolean).length;
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const key = d.toISOString().slice(0,10);
    const entry = history.find(h=>h.date===key&&h.period==="day");
    return {label:["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()],count:entry?.count||0,total:5,budget:entry?.budget||timeBudget,date:key};
  });
  const allPeriodStats = PERIODS.map(p=>{
    const items = getSuggestions(p.id);
    const done  = items.filter(i=>!!doneMap[doneKey(p.id,i.id)]).length;
    return {...p,done,total:items.length};
  });

  const phoneStyle = {
    width:"390px", minHeight:"844px", background:"#080810",
    borderRadius:"44px", overflow:"hidden", position:"relative",
    boxShadow:"0 50px 150px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)",
    fontFamily:"'DM Sans',sans-serif", color:"#fff", display:"flex", flexDirection:"column",
  };

  // ─── ONBOARDING ──────────────────────────────────────────────────────────

  if (screen === "onboard") {

    const handleGetLocation = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const {latitude: lat, longitude: lng} = pos.coords;
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const data = await resp.json();
          const city    = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "your area";
          const country = data.address?.country || "";
          setUserLocation({city, country, lat, lng});
        } catch(e) { console.error(e); }
      }, (err) => console.warn("Location denied", err));
    };

    // ── Step 1: Interests ──────────────────────────────────────────────────
    if (onboardStep === "interests") return (
      <>
        <style>{CSS}</style>
        <div style={phoneStyle}>
          <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>
            <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"36px 28px 60px"}}>
            <div style={{display:"flex",gap:"6px",marginBottom:"32px"}}>
              <div style={{width:"24px",height:"4px",borderRadius:"2px",background:"#FF6B6B"}}/>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
            </div>
            <div style={{animation:"fadeUp 0.5s ease both"}}>
              <div style={{width:"60px",height:"60px",borderRadius:"18px",background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px",fontWeight:"800",marginBottom:"28px",boxShadow:"0 12px 40px rgba(255,107,107,0.45)",fontFamily:"'Playfair Display',serif"}}>5</div>
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"38px",lineHeight:"1.05",marginBottom:"10px"}}>Five a Day.</h1>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"15px",lineHeight:"1.65",marginBottom:"36px"}}>
                Five things. Every day. A life worth living.
                <br/><br/>Pick up to 8 interests to personalise your suggestions.
              </p>
            </div>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"14px"}}>Your interests · {interests.length}/8</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"36px"}}>
              {INTERESTS.map(i=><Chip key={i} label={i} selected={interests.includes(i)} onToggle={(v)=>setInterests(p=>p.includes(v)?p.filter(x=>x!==v):p.length<8?[...p,v]:p)}/>)}
            </div>
            <button onClick={()=>setOnboardStep("time")} disabled={interests.length===0} style={{
              width:"100%",padding:"17px",borderRadius:"18px",border:"none",
              background:interests.length>0?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"rgba(255,255,255,0.07)",
              color:interests.length>0?"#fff":"rgba(255,255,255,0.25)",
              fontSize:"16px",fontWeight:"700",cursor:interests.length>0?"pointer":"not-allowed",
              fontFamily:"'DM Sans',sans-serif",
              boxShadow:interests.length>0?"0 10px 40px rgba(255,107,107,0.45)":"none",transition:"all 0.2s",
            }}>Next →</button>
          </div>
        </div>
      </>
    );

    // ── Step 2: Time commitment ────────────────────────────────────────────
    if (onboardStep === "time") return (
      <>
        <style>{CSS}</style>
        <div style={phoneStyle}>
          <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>
            <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"36px 28px 60px"}}>
            <div style={{display:"flex",gap:"6px",marginBottom:"32px"}}>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
              <div style={{width:"24px",height:"4px",borderRadius:"2px",background:"#FF6B6B"}}/>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
            </div>
            <button onClick={()=>setOnboardStep("interests")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"14px",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"34px",lineHeight:"1.1",marginBottom:"10px"}}>How much time<br/>can you commit<br/>each day?</h1>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"15px",lineHeight:"1.65",marginBottom:"32px"}}>
              We'll tailor your 5 daily suggestions to fit exactly this window. You can always change it later.
            </p>
            <div style={{display:"flex",gap:"8px",marginBottom:"32px"}}>
              {TIME_TIERS.map(t=><TimeTile key={t.mins} tier={t} selected={timeBudget===t.mins} onSelect={setTimeBudget}/>)}
            </div>
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"16px",marginBottom:"28px"}}>
              {(()=>{ const tier=TIME_TIERS.find(t=>t.mins===timeBudget); const pi=Math.round(timeBudget/5); return (
                <p style={{fontSize:"14px",color:"rgba(255,255,255,0.7)",lineHeight:"1.6",margin:0}}>
                  5 daily activities · ~{pi} min each · {timeBudget} min total
                  <br/><span style={{color:tier?.color,fontWeight:"600"}}>{tier?.desc} — {timeBudget===15?"perfect for busy days":"you've got this ✨"}</span>
                </p>
              );})()}
            </div>
            <button onClick={()=>setOnboardStep("profile")} style={{
              width:"100%",padding:"17px",borderRadius:"18px",border:"none",
              background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:"#fff",
              fontSize:"16px",fontWeight:"700",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 10px 40px rgba(255,107,107,0.45)",transition:"all 0.2s",
            }}>Next →</button>
          </div>
        </div>
      </>
    );

    // ── Step 3: Age + Location ─────────────────────────────────────────────
    return (
      <>
        <style>{CSS}</style>
        <div style={phoneStyle}>
          <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>
            <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"36px 28px 60px"}}>
            <div style={{display:"flex",gap:"6px",marginBottom:"32px"}}>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
              <div style={{width:"8px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,0.15)"}}/>
              <div style={{width:"24px",height:"4px",borderRadius:"2px",background:"#FF6B6B"}}/>
            </div>
            <button onClick={()=>setOnboardStep("time")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"14px",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"34px",lineHeight:"1.1",marginBottom:"10px"}}>Make it<br/>truly yours.</h1>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"15px",lineHeight:"1.65",marginBottom:"32px"}}>
              Your age range and location let us suggest real places near you and ideas that match your life stage.
            </p>

            {/* Age group */}
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"14px"}}>Your age range</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"28px"}}>
              {AGE_GROUPS.map(ag=>(
                <button key={ag.id} onClick={()=>setAgeGroup(ag.id)} style={{
                  padding:"14px 10px",borderRadius:"16px",border:"none",cursor:"pointer",
                  background:ageGroup===ag.id?`${ag.color}18`:"rgba(255,255,255,0.05)",
                  outline:ageGroup===ag.id?`2px solid ${ag.color}`:"2px solid transparent",
                  transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",
                }}>
                  <span style={{fontSize:"22px"}}>{ag.emoji}</span>
                  <span style={{color:ageGroup===ag.id?ag.color:"#fff",fontSize:"16px",fontWeight:"700",fontFamily:"'DM Sans',sans-serif"}}>{ag.label}</span>
                  <span style={{color:ageGroup===ag.id?ag.color:"rgba(255,255,255,0.35)",fontSize:"11px",fontFamily:"'DM Sans',sans-serif",textAlign:"center"}}>{ag.desc}</span>
                </button>
              ))}
            </div>

            {/* Location */}
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"6px"}}>
              Location <span style={{color:"rgba(255,255,255,0.2)",fontWeight:"400",textTransform:"none",fontSize:"10px"}}>— optional</span>
            </p>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",marginBottom:"12px"}}>We'll find real trails, parks and places near you.</p>
            {userLocation ? (
              <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:"16px",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <div>
                  <p style={{fontSize:"15px",fontWeight:"600",color:"#4ADE80",marginBottom:"2px"}}>📍 {userLocation.city}</p>
                  <p style={{fontSize:"12px",color:"rgba(255,255,255,0.4)"}}>{userLocation.country} · Suggestions will include nearby places</p>
                </div>
                <button onClick={()=>{setUserLocation(null);save("fad_location",null);}} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"5px 10px",color:"rgba(255,255,255,0.4)",fontSize:"11px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear</button>
              </div>
            ) : (
              <button onClick={handleGetLocation} style={{
                width:"100%",padding:"14px",borderRadius:"16px",
                border:"1px dashed rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.04)",
                color:"rgba(255,255,255,0.65)",fontSize:"14px",fontWeight:"500",
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
                display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"8px",
              }}>📍 Use my location</button>
            )}
            <p style={{fontSize:"11px",color:"rgba(255,255,255,0.18)",marginBottom:"28px",textAlign:"center"}}>Only used to find nearby places. Never sent to a server.</p>

            <button onClick={()=>setScreen("app")} disabled={!ageGroup} style={{
              width:"100%",padding:"17px",borderRadius:"18px",border:"none",
              background:ageGroup?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"rgba(255,255,255,0.07)",
              color:ageGroup?"#fff":"rgba(255,255,255,0.25)",
              fontSize:"16px",fontWeight:"700",cursor:ageGroup?"pointer":"not-allowed",
              fontFamily:"'DM Sans',sans-serif",
              boxShadow:ageGroup?"0 10px 40px rgba(255,107,107,0.45)":"none",transition:"all 0.2s",
            }}>Start my Five a Day →</button>
            {!ageGroup && <p style={{textAlign:"center",fontSize:"12px",color:"rgba(255,255,255,0.2)",marginTop:"10px"}}>Pick an age range to continue</p>}
          </div>
        </div>
      </>
    );
  }

  // ─── EDIT INTERESTS ───────────────────────────────────────────────────────

  if (editInterests) {
    return (
      <>
        <style>{CSS}</style>
        <div style={phoneStyle}>
          <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>
            <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"36px 28px 60px"}}>
            <button onClick={()=>setEditInterests(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"14px",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"32px",marginBottom:"10px",animation:"fadeUp 0.4s ease both"}}>Update your<br/>interests.</h1>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"14px",marginBottom:"28px",animation:"fadeUp 0.4s ease 0.05s both"}}>Pick the areas that matter most right now.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"32px",animation:"fadeUp 0.4s ease 0.1s both"}}>
              {INTERESTS.map(i=><Chip key={i} label={i} selected={tempInterests.includes(i)} onToggle={(v)=>setTempInterests(p=>p.includes(v)?p.filter(x=>x!==v):p.length<8?[...p,v]:p)}/>)}
            </div>
            <button onClick={()=>{setInterests(tempInterests);setEditInterests(false);}} disabled={tempInterests.length===0} style={{
              width:"100%",padding:"17px",borderRadius:"18px",border:"none",
              background:tempInterests.length>0?"linear-gradient(135deg,#FF6B6B,#FF8E53)":"rgba(255,255,255,0.07)",
              color:tempInterests.length>0?"#fff":"rgba(255,255,255,0.25)",
              fontSize:"16px",fontWeight:"700",cursor:tempInterests.length>0?"pointer":"not-allowed",
              fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",
              boxShadow:tempInterests.length>0?"0 10px 40px rgba(255,107,107,0.45)":"none",
            }}>Save interests →</button>
          </div>
        </div>
      </>
    );
  }

  // ─── EDIT TIME BUDGET ─────────────────────────────────────────────────────

  if (editTime) {
    return (
      <>
        <style>{CSS}</style>
        <div style={phoneStyle}>
          <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)"}}>
            <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"36px 28px 60px"}}>
            <button onClick={()=>setEditTime(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:"14px",marginBottom:"24px",fontFamily:"'DM Sans',sans-serif",padding:0}}>← Back</button>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"32px",marginBottom:"10px",animation:"fadeUp 0.4s ease both"}}>Daily time<br/>commitment.</h1>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:"14px",marginBottom:"28px",animation:"fadeUp 0.4s ease 0.05s both"}}>Your 5 daily suggestions will be tailored to fit this window.</p>
            <div style={{display:"flex",gap:"8px",marginBottom:"32px",animation:"fadeUp 0.4s ease 0.1s both"}}>
              {TIME_TIERS.map(t=><TimeTile key={t.mins} tier={t} selected={tempTime===t.mins} onSelect={setTempTime}/>)}
            </div>

            {/* Preview */}
            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"16px",marginBottom:"28px",animation:"fadeUp 0.4s ease 0.2s both"}}>
              {(() => {
                const tier = TIME_TIERS.find(t=>t.mins===tempTime);
                const perItem = Math.round(tempTime/5);
                return (
                  <p style={{fontSize:"14px",color:"rgba(255,255,255,0.7)",lineHeight:"1.6",margin:0}}>
                    5 daily activities · ~{perItem} min each · {tempTime} min total
                    <br/><span style={{color:tier?.color,fontWeight:"600"}}>{tier?.desc} — {tempTime===15?"micro-habits":"you've got this ✨"}</span>
                  </p>
                );
              })()}
            </div>

            <button onClick={()=>{setTimeBudget(tempTime);setEditTime(false);}} style={{
              width:"100%",padding:"17px",borderRadius:"18px",border:"none",
              background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:"#fff",
              fontSize:"16px",fontWeight:"700",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 10px 40px rgba(255,107,107,0.45)",transition:"all 0.2s",
            }}>Save preference →</button>
          </div>
        </div>
      </>
    );
  }

  // ─── TODAY SCREEN ─────────────────────────────────────────────────────────

  const TodayScreen = () => {
    const items  = getSuggestions(activePeriod);
    const done   = doneCount();
    const total  = items.length;
    const pct    = total ? done/total : 0;
    const period = PERIODS.find(p=>p.id===activePeriod);
    const tier   = TIME_TIERS.find(t=>t.mins===timeBudget) || TIME_TIERS[1];
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"20px 22px 0",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"5px"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"12px",background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:"800",fontFamily:"'Playfair Display',serif",boxShadow:"0 6px 20px rgba(255,107,107,0.4)"}}>5</div>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:"22px"}}>Five a Day</span>
              </div>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:"13px"}}>{done}/{total} done · {period?.desc}</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px"}}>
              {streak>0 && <StreakBadge streak={streak}/>}
              <button onClick={refreshAI} disabled={aiLoading} style={{
                background:aiLoading?"rgba(255,255,255,0.04)":"rgba(255,107,107,0.13)",
                border:"1px solid rgba(255,107,107,0.28)",borderRadius:"12px",
                padding:"7px 12px",color:"#FF6B6B",fontSize:"12px",fontWeight:"600",
                cursor:aiLoading?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",
                display:"flex",alignItems:"center",gap:"6px",
              }}>
                {aiLoading?<><span style={{width:"10px",height:"10px",border:"2px solid #FF6B6B",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/>Searching...</>:"✦ AI + Web"}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{height:"3px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",marginBottom:"16px"}}>
            <div style={{height:"100%",width:`${pct*100}%`,background:`linear-gradient(90deg,${period?.color||"#FF6B6B"},#FF8E53)`,borderRadius:"2px",transition:"width 0.4s ease"}}/>
          </div>

          {/* Period tabs */}
          <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"12px",scrollbarWidth:"none"}}>
            {PERIODS.map(p=>(
              <button key={p.id} onClick={()=>setActivePeriod(p.id)} style={{
                background:activePeriod===p.id?`${p.color}22`:"rgba(255,255,255,0.04)",
                border:`1px solid ${activePeriod===p.id?`${p.color}55`:"rgba(255,255,255,0.07)"}`,
                borderRadius:"20px",padding:"6px 13px",
                color:activePeriod===p.id?p.color:"rgba(255,255,255,0.4)",
                fontSize:"12px",fontWeight:activePeriod===p.id?"700":"400",
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",transition:"all 0.2s",
              }}>{p.emoji} {p.full}</button>
            ))}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"8px 22px 100px"}}>
          {aiCache[cacheKey(activePeriod)] && (
            <div style={{background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",borderRadius:"12px",padding:"9px 14px",marginBottom:"14px",fontSize:"12px",color:"rgba(255,107,107,0.85)",display:"flex",alignItems:"center",gap:"7px"}}>
              ✦ AI · {ageGroup} · {userLocation ? userLocation.city : "no location"} · {interests.join(" · ")}
            </div>
          )}

          {aiError && (
            <div style={{background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.25)",borderRadius:"12px",padding:"10px 14px",marginBottom:"14px",fontSize:"12px",color:"rgba(255,120,120,0.9)"}}>
              ⚠️ {aiError}
            </div>
          )}
          {activePeriod==="day" && (
            <TimeBudget items={items} budget={timeBudget} doneKeyFn={isDone}/>
          )}

          {items.map((item,i)=>(
            <Card key={item.id} item={item} done={isDone(item.id)} onToggle={toggleDone} idx={i}/>
          ))}

          {/* Discovery card — shown on Today tab (day period) only */}
          {activePeriod==="day" && (
            <DiscoveryCard
              discovery={discovery}
              done={!!discDone[todayKey()]}
              onToggle={()=>{
                const today=todayKey();
                const nd={...discDone,[today]:!discDone[today]};
                setDiscDone(nd);save("fad_disc_done",nd);
              }}
              onRefresh={refreshDiscovery}
              loading={discLoading}
              error={discError}
            />
          )}

          {doneCount()===total && total>0 && (
            <div style={{textAlign:"center",padding:"28px 0",animation:"fadeUp 0.5s ease both"}}>
              <div style={{fontSize:"48px",marginBottom:"10px"}}>🎉</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",marginBottom:"6px"}}>All done!</p>
              <p style={{color:"rgba(255,255,255,0.35)",fontSize:"14px",lineHeight:"1.6"}}>{streak>1?`${streak} day streak! 🔥`:"You're living with intention."}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── HISTORY SCREEN ───────────────────────────────────────────────────────

  const HistoryScreen = () => {
    const grouped = {};
    [...history].reverse().forEach(h=>{ if(!grouped[h.date])grouped[h.date]=[]; grouped[h.date].push(h); });
    return (
      <div style={{flex:1,overflowY:"auto",padding:"24px 22px 100px"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",marginBottom:"6px",animation:"fadeUp 0.4s ease both"}}>History</h2>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:"14px",marginBottom:"28px",animation:"fadeUp 0.4s ease 0.05s both"}}>{history.length} sessions · {totalCompleted} items completed</p>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"24px",animation:"fadeUp 0.4s ease 0.1s both"}}>
          <p style={{fontSize:"12px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:"16px"}}>Last 7 Days</p>
          <div style={{display:"flex",gap:"8px",alignItems:"flex-end",height:"80px"}}>
            {last7.map((d,i)=>{
              const isToday = d.date===todayKey();
              return (
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                  <div style={{width:"100%",background:"rgba(255,255,255,0.06)",borderRadius:"6px",height:"60px",display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
                    <div style={{width:"100%",height:`${Math.max((d.count/d.total)*100,d.count>0?10:0)}%`,background:isToday?"linear-gradient(to top,#FF6B6B,#FF8E53)":"rgba(255,255,255,0.2)",borderRadius:"6px",transition:"height 0.5s ease"}}/>
                  </div>
                  <span style={{fontSize:"10px",color:isToday?"#FF6B6B":"rgba(255,255,255,0.3)",fontWeight:isToday?"700":"400"}}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {Object.keys(grouped).length===0 && (
          <div style={{textAlign:"center",padding:"40px 0",color:"rgba(255,255,255,0.25)",fontSize:"14px"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>📭</div>
            Complete your first five things to see history!
          </div>
        )}

        {Object.entries(grouped).map(([date,entries],gi)=>(
          <div key={date} style={{marginBottom:"16px",animation:`fadeUp 0.4s ease ${gi*0.05}s both`}}>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"8px"}}>
              {date===todayKey()?"Today":new Date(date).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}
            </p>
            {entries.map((e,i)=>{
              const p = PERIODS.find(p=>p.id===e.period);
              const pct = e.total > 0 ? e.count/e.total : 0;
              const bt  = e.budget ? TIME_TIERS.find(t=>t.mins===e.budget) : null;
              return (
                <div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"14px 16px",marginBottom:"8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <span style={{fontSize:"18px"}}>{p?.emoji}</span>
                    <div>
                      <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{p?.full}</p>
                      <p style={{fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>
                        {e.count}/{e.total} done{bt?` · ${bt.mins} min budget`:""}
                      </p>
                    </div>
                  </div>
                  <div style={{width:"44px",height:"44px",borderRadius:"50%",background:`conic-gradient(${p?.color||"#FF6B6B"} ${Math.min(pct*360,360)}deg, rgba(255,255,255,0.08) 0deg)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <div style={{width:"30px",height:"30px",borderRadius:"50%",background:"#080810",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"700",color:pct===1?"#4ADE80":"rgba(255,255,255,0.7)"}}>
                      {pct===1?"✓":`${Math.round(pct*100)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // ─── PROGRESS SCREEN ─────────────────────────────────────────────────────

  const ProgressScreen = () => {
    const dayEntries  = history.filter(h=>h.period==="day");
    const perfectDays = dayEntries.filter(h=>h.count===h.total).length;
    const tier = TIME_TIERS.find(t=>t.mins===timeBudget)||TIME_TIERS[1];
    return (
      <div style={{flex:1,overflowY:"auto",padding:"24px 22px 100px"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",marginBottom:"6px",animation:"fadeUp 0.4s ease both"}}>Progress</h2>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:"14px",marginBottom:"24px",animation:"fadeUp 0.4s ease 0.05s both"}}>Your journey so far</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"20px",animation:"fadeUp 0.4s ease 0.1s both"}}>
          {[
            {label:"Day Streak",   val:streak,            icon:"🔥", color:"#FBBF24"},
            {label:"Total Done",   val:totalCompleted,     icon:"✅", color:"#4ADE80"},
            {label:"Perfect Days", val:perfectDays,        icon:"⭐", color:"#C084FC"},
            {label:"Days Active",  val:dayEntries.length,  icon:"📆", color:"#60A5FA"},
          ].map((s,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"16px"}}>
              <div style={{fontSize:"24px",marginBottom:"8px"}}>{s.icon}</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",color:s.color,marginBottom:"2px"}}>{s.val}</p>
              <p style={{fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Current time commitment */}
        <div style={{background:`${tier.color}10`,border:`1px solid ${tier.color}25`,borderRadius:"16px",padding:"16px",marginBottom:"16px",animation:"fadeUp 0.4s ease 0.15s both",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"4px"}}>Daily Commitment</p>
            <p style={{fontSize:"20px",fontWeight:"700",color:tier.color,fontFamily:"'Playfair Display',serif"}}>{tier.emoji} {tier.label}</p>
            <p style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"2px"}}>{tier.desc} · {tier.sub}</p>
          </div>
          <button onClick={()=>{setTempTime(timeBudget);setEditTime(true);}} style={{background:`${tier.color}18`,border:`1px solid ${tier.color}35`,borderRadius:"10px",padding:"7px 12px",color:tier.color,fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Change</button>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"16px",animation:"fadeUp 0.4s ease 0.2s both"}}>
          <p style={{fontSize:"12px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:"16px"}}>Progress by Period</p>
          {allPeriodStats.map((p,i)=>(
            <div key={p.id} style={{marginBottom:i<allPeriodStats.length-1?"16px":"0"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontSize:"13px",color:"rgba(255,255,255,0.7)"}}>{p.emoji} {p.full}</span>
                <span style={{fontSize:"12px",color:p.color,fontWeight:"600"}}>{p.done}/{p.total}</span>
              </div>
              <div style={{height:"5px",background:"rgba(255,255,255,0.06)",borderRadius:"3px"}}>
                <div style={{height:"100%",width:`${(p.done/p.total)*100}%`,background:p.color,borderRadius:"3px",transition:"width 0.5s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── PROFILE SCREEN ───────────────────────────────────────────────────────

  const ProfileScreen = () => {
    const tier = TIME_TIERS.find(t=>t.mins===timeBudget)||TIME_TIERS[1];
    return (
      <div style={{flex:1,overflowY:"auto",padding:"24px 22px 100px"}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",marginBottom:"6px",animation:"fadeUp 0.4s ease both"}}>Profile</h2>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:"14px",marginBottom:"28px",animation:"fadeUp 0.4s ease 0.05s both"}}>Customise your experience</p>

        {/* Time commitment */}
        <div style={{background:`${tier.color}0e`,border:`1px solid ${tier.color}22`,borderRadius:"20px",padding:"20px",marginBottom:"14px",animation:"fadeUp 0.4s ease 0.1s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div>
              <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"3px"}}>Daily Time Commitment</p>
              <p style={{fontSize:"13px",color:tier.color,fontWeight:"600"}}>{tier.emoji} {tier.label} · {tier.desc}</p>
            </div>
            <button onClick={()=>{setTempTime(timeBudget);setEditTime(true);}} style={{background:`${tier.color}18`,border:`1px solid ${tier.color}35`,borderRadius:"10px",padding:"5px 12px",color:tier.color,fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Change</button>
          </div>
          <div style={{display:"flex",gap:"6px"}}>
            {TIME_TIERS.map(t=>(
              <div key={t.mins} style={{flex:1,height:"4px",borderRadius:"3px",background:t.mins===timeBudget?t.color:"rgba(255,255,255,0.08)",transition:"background 0.2s"}}/>
            ))}
          </div>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",marginTop:"8px"}}>Your 5 daily suggestions are tailored to fit this window exactly.</p>
        </div>

        {/* Age & Location */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"14px",animation:"fadeUp 0.4s ease 0.15s both"}}>
          <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"14px"}}>About You</p>
          {/* Age */}
          <div style={{marginBottom:"16px"}}>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"10px"}}>Age Range</p>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {AGE_GROUPS.map(ag=>(
                <button key={ag.id} onClick={()=>setAgeGroup(ag.id)} style={{
                  padding:"7px 14px",borderRadius:"20px",border:"none",cursor:"pointer",
                  background:ageGroup===ag.id?`${ag.color}20`:"rgba(255,255,255,0.05)",
                  outline:ageGroup===ag.id?`1px solid ${ag.color}`:"1px solid transparent",
                  color:ageGroup===ag.id?ag.color:"rgba(255,255,255,0.4)",
                  fontSize:"13px",fontWeight:ageGroup===ag.id?"700":"400",
                  fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",
                }}>{ag.emoji} {ag.label}</button>
              ))}
            </div>
          </div>
          {/* Location */}
          <div>
            <p style={{fontSize:"11px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:"10px"}}>Location</p>
            {userLocation ? (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <span style={{fontSize:"16px"}}>📍</span>
                  <div>
                    <p style={{fontSize:"14px",fontWeight:"600",color:"#4ADE80"}}>{userLocation.city}</p>
                    <p style={{fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>{userLocation.country}</p>
                  </div>
                </div>
                <button onClick={()=>{setUserLocation(null);save("fad_location",null);}} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",padding:"5px 10px",color:"rgba(255,255,255,0.4)",fontSize:"11px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear</button>
              </div>
            ) : (
              <button onClick={()=>{
                if(!navigator.geolocation)return;
                navigator.geolocation.getCurrentPosition(async(pos)=>{
                  try{
                    const{latitude:lat,longitude:lng}=pos.coords;
                    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                    const d=await r.json();
                    const city=d.address?.city||d.address?.town||d.address?.village||"your area";
                    const country=d.address?.country||"";
                    setUserLocation({city,country,lat,lng});
                  }catch(e){console.error(e);}
                },(e)=>console.warn(e));
              }} style={{
                width:"100%",padding:"11px",borderRadius:"12px",
                border:"1px dashed rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.04)",
                color:"rgba(255,255,255,0.55)",fontSize:"13px",cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px",
              }}>📍 Add my location</button>
            )}
          </div>
        </div>

        {/* Interests */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"14px",animation:"fadeUp 0.4s ease 0.2s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <p style={{fontSize:"14px",fontWeight:"600"}}>Your Interests</p>
            <button onClick={()=>{setTempInterests([...interests]);setEditInterests(true);}} style={{background:"rgba(255,107,107,0.13)",border:"1px solid rgba(255,107,107,0.28)",borderRadius:"10px",padding:"5px 12px",color:"#FF6B6B",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Edit</button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
            {interests.map(i=>(
              <span key={i} style={{background:`${CAT_COLORS[i]||"#FF6B6B"}20`,color:CAT_COLORS[i]||"#FF6B6B",fontSize:"12px",fontWeight:"600",padding:"4px 11px",borderRadius:"20px",border:`1px solid ${CAT_COLORS[i]||"#FF6B6B"}35`}}>{i}</span>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"14px",animation:"fadeUp 0.4s ease 0.2s both"}}>
          <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"14px"}}>Daily Reminder</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
            <div>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",marginBottom:"2px"}}>{notifOn?"🔔 Reminders on":"🔕 Reminders off"}</p>
              <p style={{fontSize:"12px",color:"rgba(255,255,255,0.35)"}}>{notifOn?`Daily nudge at ${notifTime}`:"Turn on to get a daily nudge"}</p>
            </div>
            <button onClick={requestNotifications} style={{background:notifOn?"rgba(74,222,128,0.13)":"rgba(255,107,107,0.13)",border:`1px solid ${notifOn?"rgba(74,222,128,0.3)":"rgba(255,107,107,0.3)"}`,borderRadius:"12px",padding:"7px 14px",color:notifOn?"#4ADE80":"#FF6B6B",fontSize:"12px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {notifOn?"Enabled ✓":"Enable"}
            </button>
          </div>
          {notifOn && (
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.5)"}}>Time:</p>
              <input type="time" value={notifTime} onChange={e=>setNotifTime(e.target.value)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:"10px",padding:"6px 12px",color:"#fff",fontSize:"14px",fontWeight:"600",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"}}/>
            </div>
          )}
          {notifBanner && <div style={{marginTop:"12px",padding:"8px 12px",background:"rgba(255,255,255,0.07)",borderRadius:"10px",fontSize:"12px",color:"rgba(255,255,255,0.6)"}}>{notifBanner}</div>}
        </div>

        {/* AI status */}
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"20px",padding:"20px",marginBottom:"14px",animation:"fadeUp 0.4s ease 0.25s both"}}>
          <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"6px"}}>AI + Web Suggestions</p>
          <p style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",marginBottom:"14px",lineHeight:"1.55"}}>Tap ✦ AI + Web to generate personalised suggestions with real links. AI respects your {timeBudget}-min daily budget.</p>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {PERIODS.map(p=>{const cached=!!aiCache[cacheKey(p.id)];return(
              <span key={p.id} style={{background:cached?"rgba(74,222,128,0.1)":"rgba(255,255,255,0.05)",color:cached?"#4ADE80":"rgba(255,255,255,0.3)",fontSize:"11px",padding:"4px 10px",borderRadius:"20px",border:`1px solid ${cached?"rgba(74,222,128,0.25)":"rgba(255,255,255,0.08)"}`}}>
                {cached?"✓ ":""}{p.emoji} {p.label}
              </span>
            );})}
          </div>
        </div>

        {/* Reset */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"20px",padding:"20px",animation:"fadeUp 0.4s ease 0.3s both"}}>
          <p style={{fontSize:"14px",fontWeight:"600",marginBottom:"6px",color:"rgba(255,100,100,0.8)"}}>Reset Progress</p>
          <p style={{fontSize:"13px",color:"rgba(255,255,255,0.3)",marginBottom:"14px"}}>Clears completions, history and streaks. Interests, time preference and AI suggestions are kept.</p>
          <button onClick={()=>{
            if(window.confirm("Reset all progress? This can't be undone.")){
              setDoneMap({});setHistory([]);setStreak(0);setLastActive("");
              save("fad_done",{});save("fad_history",[]);save("fad_streak",0);save("fad_last_active","");
            }
          }} style={{background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.2)",borderRadius:"12px",padding:"8px 16px",color:"rgba(255,100,100,0.8)",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
            Reset progress
          </button>
        </div>
      </div>
    );
  };

  // ─── APP SHELL ────────────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div style={phoneStyle}>
        <div style={{padding:"14px 28px 0",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"rgba(255,255,255,0.3)",flexShrink:0}}>
          <span>9:41</span><span style={{letterSpacing:"2px"}}>●●●</span>
        </div>

        {nav==="today"    && <TodayScreen/>}
        {nav==="history"  && <HistoryScreen/>}
        {nav==="progress" && <ProgressScreen/>}
        {nav==="profile"  && <ProfileScreen/>}

        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 8px 28px",background:"linear-gradient(to top,#080810 65%,transparent)",display:"flex",justifyContent:"space-around"}}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setNav(n.id)} style={{background:"none",border:"none",color:nav===n.id?"#FF6B6B":"rgba(255,255,255,0.28)",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",fontFamily:"'DM Sans',sans-serif",transition:"color 0.2s",padding:"4px 16px"}}>
              <span style={{fontSize:"20px"}}>{n.icon}</span>
              <span style={{fontSize:"10px",fontWeight:nav===n.id?"700":"400",letterSpacing:"0.3px"}}>{n.label}</span>
              {nav===n.id && <div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#FF6B6B",marginTop:"1px"}}/>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background: radial-gradient(ellipse at 30% 20%, #1a0a0a 0%, #0d0d1a 50%, #080810 100%); display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin   { to { transform:rotate(360deg); } }
  ::-webkit-scrollbar { display:none; }
  scrollbar-width:none;
  input[type="time"]::-webkit-calendar-picker-indicator { filter:invert(1) opacity(0.4); }
`;
