/**
 * Resume template seed data — 10 professionally designed templates.
 *
 * Conventions:
 *   - Data placeholders: {{name}}, {{phone}}, {{email}}, {{avatar}}, {{school}},
 *     {{major}}, {{graduationYear}}, {{selfIntro}}, {{skills}},
 *     {{education}}, {{experience}}, {{projects}}, {{awards}}, {{activities}},
 *     {{targetPosition}}, {{expectedSalary}}, {{preferredCity}}, {{workType}}
 *   - Colour placeholder: THEMECOLOR (replaced per-variant before DB insert)
 *   - Section headings use English so the runtime `sectionLabels(locale)`
 *     swap can translate them to the active locale.
 */

export interface TemplateSeed {
  name: string;
  description: string;
  category: string;
  htmlContent: string;
  cssContent: string;
  sort: number;
}

/* ------------------------------------------------------------------ */
/*  1. 简约标准 — Clean single-column                                   */
/* ------------------------------------------------------------------ */
const cleanHtml = `
<div class="resume">
  <div class="header">
    <h1>{{name}}</h1>
    <p class="subtitle">{{targetPosition}}</p>
    <div class="contact-bar">
      <span>{{phone}}</span>
      <span>{{email}}</span>
      <span>{{school}} · {{major}} · {{graduationYear}}</span>
    </div>
  </div>
  <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>Education</h2>{{education}}</div>
  <div class="section"><h2>Work Experience</h2>{{experience}}</div>
  <div class="section"><h2>Projects</h2>{{projects}}</div>
  <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
  <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
  <div class="section"><h2>Activities</h2>{{activities}}</div>
</div>`;

const cleanCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff;padding:48px 40px}
.resume{max-width:780px;margin:0 auto}
.header{text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid THEMECOLOR}
.header h1{font-size:30px;font-weight:700;color:THEMECOLOR;letter-spacing:2px;margin-bottom:4px}
.header .subtitle{font-size:14px;color:#718096;margin-bottom:8px}
.contact-bar{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;font-size:13px;color:#4a5568}
.contact-bar span::before{content:'';display:inline-block;width:4px;height:4px;background:THEMECOLOR;border-radius:50%;vertical-align:middle;margin-right:6px}
.section{margin-bottom:22px}
.section h2{font-size:15px;font-weight:600;color:THEMECOLOR;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c;font-weight:600}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR12;color:THEMECOLOR;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid THEMECOLOR30;line-height:1.4}
@media print{body{padding:20px}@page{margin:12mm}}
`;

/* ------------------------------------------------------------------ */
/*  2. 商务精英 — Professional sidebar                                  */
/* ------------------------------------------------------------------ */
const sidebarHtml = `
<div class="resume two-col">
  <aside class="sidebar">
    <div class="avatar-wrap">
      <img class="avatar-img" src="{{avatar}}" alt="" />
    </div>
    <h1 class="sidebar-name">{{name}}</h1>
    <p class="sidebar-title">{{targetPosition}}</p>
    <div class="sidebar-section">
      <h3>Contact</h3>
      <ul>
        <li>{{phone}}</li>
        <li>{{email}}</li>
        <li>{{preferredCity}}</li>
      </ul>
    </div>
    <div class="sidebar-section">
      <h3>Education</h3>
      <p>{{school}}</p>
      <p>{{major}}</p>
      <p>{{graduationYear}}</p>
    </div>
    <div class="sidebar-section">
      <h3>Skills</h3>
      <div class="skills">{{skills}}</div>
    </div>
  </aside>
  <main class="main">
    <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
    <div class="section"><h2>Work Experience</h2>{{experience}}</div>
    <div class="section"><h2>Projects</h2>{{projects}}</div>
    <div class="section"><h2>Education</h2>{{education}}</div>
    <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
    <div class="section"><h2>Activities</h2>{{activities}}</div>
  </main>
</div>`;

const sidebarCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff}
.two-col{display:flex;min-height:100vh}
.sidebar{width:260px;background:THEMECOLOR;color:#fff;padding:36px 24px;flex-shrink:0}
.avatar-wrap{text-align:center;margin-bottom:16px}
.avatar-img{width:88px;height:auto;max-height:120px;border-radius:8px;object-fit:cover;border:3px solid rgba(255,255,255,.35);box-shadow:0 2px 8px rgba(0,0,0,.15)}
.sidebar-name{text-align:center;font-size:22px;font-weight:700;margin-bottom:2px}
.sidebar-title{text-align:center;font-size:13px;opacity:.8;margin-bottom:20px}
.sidebar-section{margin-bottom:22px}
.sidebar-section h3{font-size:13px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.25);font-weight:600}
.sidebar-section p,.sidebar-section li{font-size:13px;margin-bottom:4px;opacity:.92;line-height:1.6}
.sidebar-section ul{list-style:none}
.sidebar .skills{display:flex;flex-wrap:wrap;gap:6px;align-items:center;align-content:center}
.sidebar .skill-tag{display:inline-flex;align-items:center;background:rgba(255,255,255,.18);color:#fff;padding:3px 10px;border-radius:4px;font-size:11px;line-height:1.4}
.main{flex:1;padding:36px 32px}
.section{margin-bottom:22px}
.section h2{font-size:16px;font-weight:700;color:THEMECOLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid THEMECOLOR;display:inline-block}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
@media print{body{padding:0}.sidebar{width:220px;padding:24px 16px}@page{margin:8mm}}
`;

/* ------------------------------------------------------------------ */
/*  3. 顶部横幅 — Top banner with grid body                            */
/* ------------------------------------------------------------------ */
const bannerHtml = `
<div class="resume">
  <header class="banner">
    <div class="banner-inner">
      <div class="banner-avatar">
        <img class="avatar-img" src="{{avatar}}" alt="" />
      </div>
      <div class="banner-info">
        <h1>{{name}}</h1>
        <p class="tagline">{{targetPosition}}</p>
        <div class="contact-row">
          <span>{{phone}}</span><span>{{email}}</span>
          <span>{{school}} · {{major}}</span>
        </div>
      </div>
    </div>
  </header>
  <div class="body">
    <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
    <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
    <div class="columns">
      <div class="section"><h2>Education</h2>{{education}}</div>
      <div class="section"><h2>Work Experience</h2>{{experience}}</div>
    </div>
    <div class="section"><h2>Projects</h2>{{projects}}</div>
    <div class="columns">
      <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
      <div class="section"><h2>Activities</h2>{{activities}}</div>
    </div>
  </div>
</div>`;

const bannerCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff}
.banner{background:linear-gradient(135deg,THEMECOLOR,THEMECOLORcc);color:#fff;padding:36px 40px}
.banner-inner{display:flex;align-items:center;gap:24px;max-width:780px;margin:0 auto}
.banner-avatar .avatar-img{width:80px;height:auto;max-height:110px;border-radius:8px;object-fit:cover;border:3px solid rgba(255,255,255,.4)}
.banner-info h1{font-size:28px;font-weight:700;letter-spacing:2px;margin-bottom:4px}
.tagline{font-size:14px;opacity:.85;margin-bottom:8px}
.contact-row{display:flex;flex-wrap:wrap;gap:16px;font-size:13px;opacity:.9}
.body{padding:32px 40px;max-width:780px;margin:0 auto}
.section{margin-bottom:22px}
.section h2{font-size:15px;font-weight:600;color:THEMECOLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.columns{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR10;color:THEMECOLOR;padding:4px 14px;border-radius:20px;font-size:12px;border:1px solid THEMECOLOR30;line-height:1.4}
@media print{.banner{padding:24px 32px}body{padding:0}@page{margin:10mm}}
`;

/* ------------------------------------------------------------------ */
/*  4. 时间线 — Timeline layout                                        */
/* ------------------------------------------------------------------ */
const timelineHtml = `
<div class="resume">
  <div class="header">
    <h1>{{name}}</h1>
    <p class="target">{{targetPosition}}</p>
    <div class="contact">
      <span>{{phone}}</span> · <span>{{email}}</span> ·
      <span>{{school}} {{major}} {{graduationYear}}</span>
    </div>
  </div>
  <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>Education</h2><div class="timeline">{{education}}</div></div>
  <div class="section"><h2>Work Experience</h2><div class="timeline">{{experience}}</div></div>
  <div class="section"><h2>Projects</h2><div class="timeline">{{projects}}</div></div>
  <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
  <div class="section"><h2>Awards & Certificates</h2><div class="timeline">{{awards}}</div></div>
  <div class="section"><h2>Activities</h2><div class="timeline">{{activities}}</div></div>
</div>`;

const timelineCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff;padding:44px 40px}
.resume{max-width:780px;margin:0 auto}
.header{margin-bottom:28px;padding-bottom:18px;border-bottom:3px solid THEMECOLOR}
.header h1{font-size:28px;font-weight:700;color:THEMECOLOR;margin-bottom:2px}
.header .target{font-size:14px;color:#718096;margin-bottom:6px}
.contact{font-size:13px;color:#4a5568}
.section{margin-bottom:24px}
.section h2{font-size:15px;font-weight:600;color:THEMECOLOR;margin-bottom:12px;display:flex;align-items:center;gap:8px}
.section h2::before{content:'';width:4px;height:18px;background:THEMECOLOR;border-radius:2px;flex-shrink:0}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.timeline{border-left:2px solid THEMECOLOR30;padding-left:20px;margin-left:4px}
.item{margin-bottom:14px;position:relative;font-size:14px;line-height:1.7}
.item::before{content:'';position:absolute;left:-25px;top:7px;width:10px;height:10px;background:THEMECOLOR;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px THEMECOLOR}
.item strong{color:#1a202c;font-weight:600}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR10;color:THEMECOLOR;padding:4px 14px;border-radius:6px;font-size:12px;font-weight:500;line-height:1.4}
@media print{body{padding:20px}@page{margin:12mm}}
`;

/* ------------------------------------------------------------------ */
/*  5. 极简主义 — Minimalist                                            */
/* ------------------------------------------------------------------ */
const minimalHtml = `
<div class="resume">
  <div class="header">
    <div class="name-block">
      <h1>{{name}}</h1>
      <span class="divider"></span>
      <p class="target">{{targetPosition}}</p>
    </div>
    <div class="contact-block">
      <p>{{phone}}</p>
      <p>{{email}}</p>
      <p>{{school}} · {{major}}</p>
    </div>
  </div>
  <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>Education</h2>{{education}}</div>
  <div class="section"><h2>Work Experience</h2>{{experience}}</div>
  <div class="section"><h2>Projects</h2>{{projects}}</div>
  <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
  <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
  <div class="section"><h2>Activities</h2>{{activities}}</div>
</div>`;

const minimalCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Georgia','Noto Serif SC','SimSun',serif;color:#333;background:#fff;padding:52px 48px}
.resume{max-width:740px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid #333}
.name-block h1{font-size:32px;font-weight:400;letter-spacing:4px;color:#111}
.name-block .divider{display:block;width:40px;height:2px;background:THEMECOLOR;margin:8px 0}
.name-block .target{font-size:14px;color:#666;font-style:italic}
.contact-block{text-align:right;font-size:13px;color:#555;line-height:1.8}
.section{margin-bottom:24px}
.section h2{font-size:13px;text-transform:uppercase;letter-spacing:3px;color:THEMECOLOR;margin-bottom:12px;font-weight:600}
.section p{line-height:1.9;font-size:14px;color:#444}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#222;font-weight:600}
.item .time{color:#999;font-size:12px;float:right}
.item p{color:#666;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:10px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;color:THEMECOLOR;font-size:13px;font-weight:500;padding:2px 0;line-height:1.4}
.skill-tag::after{content:' ·';color:#ccc}
.skill-tag:last-child::after{content:''}
@media print{body{padding:24px}@page{margin:15mm}}
`;

/* ------------------------------------------------------------------ */
/*  6. 现代卡片 — Modern card layout                                    */
/* ------------------------------------------------------------------ */
const cardHtml = `
<div class="resume">
  <div class="hero">
    <img class="avatar-img" src="{{avatar}}" alt="" />
    <div class="hero-text">
      <h1>{{name}}</h1>
      <p class="hero-role">{{targetPosition}}</p>
      <div class="hero-contacts">
        <span>{{phone}}</span><span>{{email}}</span>
        <span>{{preferredCity}}</span>
      </div>
    </div>
  </div>
  <div class="grid">
    <div class="card"><h2>About Me</h2><p>{{selfIntro}}</p></div>
    <div class="card"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
  </div>
  <div class="card full"><h2>Education</h2>{{education}}</div>
  <div class="card full"><h2>Work Experience</h2>{{experience}}</div>
  <div class="card full"><h2>Projects</h2>{{projects}}</div>
  <div class="grid">
    <div class="card"><h2>Awards & Certificates</h2>{{awards}}</div>
    <div class="card"><h2>Activities</h2>{{activities}}</div>
  </div>
</div>`;

const cardCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#f7fafc;padding:32px}
.resume{max-width:800px;margin:0 auto}
.hero{display:flex;align-items:center;gap:20px;background:linear-gradient(135deg,THEMECOLOR,THEMECOLORdd);color:#fff;border-radius:16px;padding:28px 32px;margin-bottom:20px}
.avatar-img{width:76px;height:auto;max-height:105px;border-radius:8px;object-fit:cover;border:3px solid rgba(255,255,255,.4);flex-shrink:0}
.hero-text h1{font-size:26px;font-weight:700;margin-bottom:2px}
.hero-role{font-size:14px;opacity:.85;margin-bottom:6px}
.hero-contacts{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;opacity:.9}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.card{background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 1px 3px rgba(0,0,0,.06);margin-bottom:16px;display:flex;flex-direction:column}
.card.full{grid-column:1/-1}
.card h2{font-size:14px;font-weight:600;color:THEMECOLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #edf2f7}
.card p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:10px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center;flex:1}
.skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR10;color:THEMECOLOR;padding:4px 12px;border-radius:8px;font-size:12px;font-weight:500;line-height:1.4}
@media print{body{background:#fff;padding:16px}.card{box-shadow:none;border:1px solid #eee}.hero{border-radius:8px}@page{margin:10mm}}
`;

/* ------------------------------------------------------------------ */
/*  7. 左侧色带 — Left accent strip                                    */
/* ------------------------------------------------------------------ */
const accentHtml = `
<div class="resume">
  <div class="accent-strip"></div>
  <div class="content">
    <div class="header">
      <h1>{{name}}</h1>
      <p class="role">{{targetPosition}}</p>
      <div class="contact-line">
        <span>{{phone}}</span><span>{{email}}</span>
        <span>{{school}} · {{major}} · {{graduationYear}}</span>
      </div>
    </div>
    <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
    <div class="section"><h2>Education</h2>{{education}}</div>
    <div class="section"><h2>Work Experience</h2>{{experience}}</div>
    <div class="section"><h2>Projects</h2>{{projects}}</div>
    <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
    <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
    <div class="section"><h2>Activities</h2>{{activities}}</div>
  </div>
</div>`;

const accentCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff}
.resume{display:flex;min-height:100vh}
.accent-strip{width:8px;background:linear-gradient(180deg,THEMECOLOR,THEMECOLORaa);flex-shrink:0}
.content{flex:1;padding:44px 40px}
.header{margin-bottom:28px}
.header h1{font-size:30px;font-weight:700;color:#1a202c;margin-bottom:2px}
.header .role{font-size:14px;color:THEMECOLOR;font-weight:500;margin-bottom:8px}
.contact-line{display:flex;flex-wrap:wrap;gap:16px;font-size:13px;color:#718096}
.section{margin-bottom:22px}
.section h2{font-size:14px;font-weight:700;color:THEMECOLOR;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;padding-left:12px;border-left:3px solid THEMECOLOR}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c;font-weight:600}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR10;color:THEMECOLOR;padding:4px 14px;border-radius:4px;font-size:12px;font-weight:500;border:1px solid THEMECOLOR25;line-height:1.4}
@media print{.accent-strip{width:6px}body{padding:0}@page{margin:10mm}}
`;

/* ------------------------------------------------------------------ */
/*  8. 右侧栏 — Right sidebar                                          */
/* ------------------------------------------------------------------ */
const rightSidebarHtml = `
<div class="resume two-col">
  <main class="main">
    <div class="header">
      <h1>{{name}}</h1>
      <p class="role">{{targetPosition}}</p>
    </div>
    <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
    <div class="section"><h2>Work Experience</h2>{{experience}}</div>
    <div class="section"><h2>Projects</h2>{{projects}}</div>
    <div class="section"><h2>Education</h2>{{education}}</div>
  </main>
  <aside class="sidebar">
    <div class="avatar-wrap">
      <img class="avatar-img" src="{{avatar}}" alt="" />
    </div>
    <div class="sidebar-section">
      <h3>Contact</h3>
      <p>{{phone}}</p>
      <p>{{email}}</p>
      <p>{{preferredCity}}</p>
    </div>
    <div class="sidebar-section">
      <h3>Education</h3>
      <p>{{school}}</p>
      <p>{{major}}</p>
      <p>{{graduationYear}}</p>
    </div>
    <div class="sidebar-section">
      <h3>Skills</h3>
      <div class="skills">{{skills}}</div>
    </div>
    <div class="sidebar-section">
      <h3>Awards & Certificates</h3>
      {{awards}}
    </div>
    <div class="sidebar-section">
      <h3>Activities</h3>
      {{activities}}
    </div>
  </aside>
</div>`;

const rightSidebarCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff}
.two-col{display:flex;min-height:100vh}
.main{flex:1;padding:40px 36px;order:1}
.sidebar{width:240px;background:#f7fafc;padding:36px 22px;flex-shrink:0;order:2;border-left:1px solid #e2e8f0}
.header{margin-bottom:24px}
.header h1{font-size:28px;font-weight:700;color:#1a202c}
.header .role{font-size:14px;color:THEMECOLOR;font-weight:500;margin-top:2px}
.avatar-wrap{text-align:center;margin-bottom:20px}
.avatar-img{width:80px;height:auto;max-height:110px;border-radius:8px;object-fit:cover;border:3px solid THEMECOLOR40}
.sidebar-section{margin-bottom:20px}
.sidebar-section h3{font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:THEMECOLOR;font-weight:700;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid #e2e8f0}
.sidebar-section p{font-size:13px;color:#4a5568;margin-bottom:3px;line-height:1.6}
.sidebar .skills{display:flex;flex-wrap:wrap;gap:5px;align-items:center;align-content:center}
.sidebar .skill-tag{display:inline-flex;align-items:center;background:THEMECOLOR12;color:THEMECOLOR;padding:2px 8px;border-radius:4px;font-size:11px;line-height:1.4}
.sidebar .item{margin-bottom:8px;font-size:12px;line-height:1.5}
.sidebar .item strong{font-size:12px}
.sidebar .item .time{font-size:11px;float:none;display:block;color:#a0aec0}
.sidebar .item p{font-size:12px}
.section{margin-bottom:22px}
.section h2{font-size:15px;font-weight:600;color:THEMECOLOR;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid THEMECOLOR}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:12px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c;font-weight:600}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
@media print{.sidebar{width:210px;background:#f9f9f9}@page{margin:8mm}}
`;

/* ------------------------------------------------------------------ */
/*  9. 双栏均分 — Two-column equal                                      */
/* ------------------------------------------------------------------ */
const twoColHtml = `
<div class="resume">
  <div class="header">
    <div class="header-left">
      <h1>{{name}}</h1>
      <p class="role">{{targetPosition}}</p>
    </div>
    <div class="header-right">
      <p>{{phone}} | {{email}}</p>
      <p>{{school}} · {{major}} · {{graduationYear}}</p>
    </div>
  </div>
  <div class="section full"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section full"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
  <div class="columns">
    <div class="col">
      <div class="section"><h2>Education</h2>{{education}}</div>
      <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
    </div>
    <div class="col">
      <div class="section"><h2>Work Experience</h2>{{experience}}</div>
      <div class="section"><h2>Activities</h2>{{activities}}</div>
    </div>
  </div>
  <div class="section full"><h2>Projects</h2>{{projects}}</div>
</div>`;

const twoColCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI','Microsoft YaHei','PingFang SC',sans-serif;color:#2d3748;background:#fff;padding:40px}
.resume{max-width:800px;margin:0 auto}
.header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid THEMECOLOR}
.header-left h1{font-size:28px;font-weight:700;color:THEMECOLOR}
.header-left .role{font-size:14px;color:#718096;margin-top:2px}
.header-right{text-align:right;font-size:13px;color:#4a5568;line-height:1.7}
.columns{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:8px}
.section{margin-bottom:20px}
.section.full{margin-bottom:20px}
.section h2{font-size:14px;font-weight:700;color:THEMECOLOR;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid #edf2f7}
.section p{line-height:1.8;font-size:14px;color:#4a5568}
.item{margin-bottom:10px;font-size:14px;line-height:1.7}
.item strong{color:#1a202c;font-weight:600}
.item .time{color:#a0aec0;font-size:12px;float:right}
.item p{color:#718096;margin-top:2px}
.skills{display:flex;flex-wrap:wrap;gap:8px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;background:#fff;color:THEMECOLOR;padding:4px 14px;border-radius:6px;font-size:12px;font-weight:500;border:1px solid THEMECOLOR;box-shadow:0 1px 2px rgba(0,0,0,.04);line-height:1.4}
@media print{body{padding:20px}@page{margin:12mm}}
`;

/* ------------------------------------------------------------------ */
/*  10. 学术文档 — Academic / formal                                    */
/* ------------------------------------------------------------------ */
const academicHtml = `
<div class="resume">
  <div class="header">
    <h1>{{name}}</h1>
    <div class="meta">
      <span>{{school}} · {{major}} · {{graduationYear}}</span>
    </div>
    <div class="meta">
      <span>{{phone}}</span> | <span>{{email}}</span> | <span>{{preferredCity}}</span>
    </div>
    <p class="objective">{{targetPosition}} {{expectedSalary}} {{workType}}</p>
  </div>
  <div class="section"><h2>About Me</h2><p>{{selfIntro}}</p></div>
  <div class="section"><h2>Education</h2>{{education}}</div>
  <div class="section"><h2>Work Experience</h2>{{experience}}</div>
  <div class="section"><h2>Projects</h2>{{projects}}</div>
  <div class="section"><h2>Awards & Certificates</h2>{{awards}}</div>
  <div class="section"><h2>Activities</h2>{{activities}}</div>
  <div class="section"><h2>Skills</h2><div class="skills">{{skills}}</div></div>
</div>`;

const academicCss = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Times New Roman','Noto Serif SC','SimSun',serif;color:#222;background:#fff;padding:48px 56px}
.resume{max-width:720px;margin:0 auto}
.header{text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:2px double THEMECOLOR}
.header h1{font-size:26px;font-weight:700;letter-spacing:6px;color:#111;margin-bottom:8px}
.meta{font-size:13px;color:#555;margin-bottom:4px}
.objective{font-size:13px;color:THEMECOLOR;margin-top:6px;font-style:italic}
.section{margin-bottom:22px}
.section h2{font-size:14px;font-weight:700;color:#111;margin-bottom:10px;padding-bottom:5px;border-bottom:1px solid #ccc;text-transform:uppercase;letter-spacing:2px}
.section h2::after{content:'';display:block;width:40px;height:2px;background:THEMECOLOR;margin-top:4px}
.section p{line-height:2;font-size:14px;color:#333;text-indent:2em}
.item{margin-bottom:12px;font-size:14px;line-height:1.8}
.item strong{color:#111;font-weight:700}
.item .time{color:#888;font-size:13px;float:right;font-style:italic}
.item p{color:#444;margin-top:2px;text-indent:0}
.skills{display:flex;flex-wrap:wrap;gap:12px;align-items:center;align-content:center}
.skill-tag{display:inline-flex;align-items:center;color:#333;font-size:13px;padding:2px 0;font-weight:500;line-height:1.4}
.skill-tag::before{content:'• ';color:THEMECOLOR}
@media print{body{padding:24px 40px}@page{margin:20mm}}
`;

/* ================================================================== */
/*  Export: build final seed array with colour variants                */
/* ================================================================== */

function applyThemeColor(css: string, color: string): string {
  return css.replace(/THEMECOLOR/g, color);
}

export function getResumeTemplateSeedData(): TemplateSeed[] {
  return [
    {
      name: 'Clean Standard',
      description: 'Clean single-column layout, suitable for most job applications',
      category: 'General',
      htmlContent: cleanHtml.trim(),
      cssContent: applyThemeColor(cleanCss, '#2563eb'),
      sort: 1,
    },
    {
      name: 'Business Elite',
      description: 'Left sidebar with avatar, professional two-column design',
      category: 'General',
      htmlContent: sidebarHtml.trim(),
      cssContent: applyThemeColor(sidebarCss, '#1e3a5f'),
      sort: 2,
    },
    {
      name: 'Tech Blue',
      description: 'Blue sidebar with a tech vibe, ideal for technical roles',
      category: 'Tech',
      htmlContent: sidebarHtml.trim(),
      cssContent: applyThemeColor(sidebarCss, '#0284c7'),
      sort: 3,
    },
    {
      name: 'Gradient Banner',
      description: 'Top gradient banner with avatar, strong visual impact',
      category: 'General',
      htmlContent: bannerHtml.trim(),
      cssContent: applyThemeColor(bannerCss, '#6366f1'),
      sort: 4,
    },
    {
      name: 'Vibrant Orange',
      description: 'Warm-toned top banner, great for marketing roles',
      category: 'Marketing',
      htmlContent: bannerHtml.trim(),
      cssContent: applyThemeColor(bannerCss, '#ea580c'),
      sort: 5,
    },
    {
      name: 'Timeline',
      description: 'Left timeline layout highlighting career progression',
      category: 'General',
      htmlContent: timelineHtml.trim(),
      cssContent: applyThemeColor(timelineCss, '#059669'),
      sort: 6,
    },
    {
      name: 'Minimalist',
      description: 'Serif font with minimal layout, ideal for design roles',
      category: 'Design',
      htmlContent: minimalHtml.trim(),
      cssContent: applyThemeColor(minimalCss, '#92400e'),
      sort: 7,
    },
    {
      name: 'Modern Card',
      description: 'Card-based layout with rounded shadows, young and trendy',
      category: 'General',
      htmlContent: cardHtml.trim(),
      cssContent: applyThemeColor(cardCss, '#7c3aed'),
      sort: 8,
    },
    {
      name: 'Accent Strip',
      description: 'Narrow accent strip with generous whitespace, premium minimalism',
      category: 'General',
      htmlContent: accentHtml.trim(),
      cssContent: applyThemeColor(accentCss, '#0891b2'),
      sort: 9,
    },
    {
      name: 'Academic Formal',
      description: 'Serif font with double-line dividers, ideal for academic & education',
      category: 'Education',
      htmlContent: academicHtml.trim(),
      cssContent: applyThemeColor(academicCss, '#1e40af'),
      sort: 10,
    },
  ];
}
