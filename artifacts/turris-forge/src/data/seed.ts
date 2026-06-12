export const C = {
  bg:      "#0D0D0F",
  sur:     "#1A1A1F",
  sur2:    "#22222A",
  gold:    "#E8912A",
  gold2:   "#FFB347",
  ash:     "#E8E4DC",
  ember:   "#C0392B",
  cyan:    "#00E5FF",
  violet:  "#9B59B6",
  violet2: "#C084FC",
  pink:    "#FF006E",
  lime:    "#A8FF3E",
  teal:    "#00F5CC",
  gray:    "#6B6870",
  gray2:   "#A09890",
};

export const SKILL_CATEGORIES = [
  "2D Animation","3D Animation","Storyboarding","Character Design",
  "Background Design","Concept Art","Coloring / Color Grading","Inking",
  "Lettering / Typography","Lip Sync Animation","VFX / Motion Graphics",
  "Sound Design Sync","In-Between Animation","Clean-Up Animation",
  "Layout & Composition","Rigging","Asset Creation","Script Adaptation",
];

export const ADMIN_SECRET = "FORGE2026";

export const SEED_JOBS = [
  { id:"j1", title:"Key Animation — Redmask Fight Scene 03", category:"2D Animation",
    difficulty:"Expert", description:"Animate 60 frames of the rooftop duel between Redmask and the Shadow Broker. Full key animation required. Reference sheets attached.", pay:250, deadline: Date.now()+3600*24*1000*3,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-3600000, messages:[] },
  { id:"j2", title:"Background Design — Ironbound Prison Block", category:"Background Design",
    difficulty:"Intermediate", description:"Design a high-security supernatural prison. Arcane runes etched into stone walls. Blend Yoruba architectural motifs with dark fantasy.", pay:120, deadline: Date.now()+3600*1000*18,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-7200000, messages:[] },
  { id:"j3", title:"Character Design — The Syndicate Boss", category:"Character Design",
    difficulty:"Expert", description:"Full turnaround sheet (front/side/back) for the main antagonist. Corporate attire fused with West African traditional garments. 3 expression sheets.", pay:180, deadline: Date.now()+3600*24*1000*5,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-900000, messages:[] },
  { id:"j4", title:"Storyboard — Iron Bound Episode 01 Cold Open", category:"Storyboarding",
    difficulty:"Intermediate", description:"Panel storyboard for the 3-minute cold open sequence. Must convey rhythm and visual language established in style guide.", pay:90, deadline: Date.now()+3600*1000*10,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-1800000, messages:[] },
  { id:"j5", title:"VFX — Spirit Manifestation Effect Pack", category:"VFX / Motion Graphics",
    difficulty:"Expert", description:"Create 8 reusable VFX sequences for spirit summons in Iron Bound. Particle-based with traditional pattern overlays.", pay:320, deadline: Date.now()+3600*24*1000*7,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-3600*2000, messages:[] },
  { id:"j6", title:"Coloring Pass — Redmask Episode 02 Act 1", category:"Coloring / Color Grading",
    difficulty:"Beginner", description:"Color flat pass for 240 frames. Line art and palette guide provided. Consistency and speed are key.", pay:60, deadline: Date.now()+3600*1000*8,
    status:"Open", submissions:[], visibility:"Public", posted: Date.now()-600000, messages:[] },
];

export const SEED_WORKERS = [
  { id:"w1", name:"Seun Adesola", email:"seun@forge.ng", role:"worker" as const,
    skills:["2D Animation","Character Design","Inking"], balance:480, joined: Date.now()-3600*24*1000*20,
    bio:"Senior animator with 7 years in Japanese-style production.", portfolio:"https://artstation.com",
    history:[], rating: 4.8, ratingCount: 5 },
  { id:"w2", name:"Tunde Eze", email:"tunde@forge.ng", role:"worker" as const,
    skills:["Background Design","Concept Art","Layout & Composition"], balance:210, joined: Date.now()-3600*24*1000*12,
    bio:"Environment specialist. Background in architectural illustration.", portfolio:"",
    history:[], rating: 4.2, ratingCount: 3 },
];
