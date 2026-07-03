/* Website Selector — Voss Systems
   All state lives in memory. Nothing is sent anywhere, nothing is stored. */

(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Data ----------

  const BUSINESS_TYPES = [
    "Web design studio",
    "AI / automation",
    "Dentist",
    "SaaS product",
    "Real estate",
    "Personal trainer",
    "Restaurant",
    "E-commerce",
    "Photographer",
    "Law firm",
    "Marketing agency",
    "Coaching",
  ];

  const STYLES = [
    {
      id: "clean",
      label: "Clean & Modern",
      prompt: "clean and modern. Light background, generous whitespace, one blue accent, a modern sans-serif, sharp edges.",
    },
    {
      id: "dark",
      label: "Bold & Dark",
      prompt: "bold and dark. Near-black background, high contrast, oversized type, one strong accent color used sparingly.",
    },
    {
      id: "warm",
      label: "Warm & Earthy",
      prompt: "warm and earthy. Cream background, terracotta and olive tones, soft serif headings, natural photography.",
    },
    {
      id: "playful",
      label: "Playful & Soft",
      prompt: "playful and soft. Pastel palette, fully rounded corners, friendly type, light illustration.",
    },
    {
      id: "luxury",
      label: "Luxury & Elegant",
      prompt: "luxury and elegant. Ivory and charcoal, serif headings, thin hairline rules, one restrained gold accent, lots of air.",
    },
    {
      id: "vibrant",
      label: "Vibrant & Gradient",
      prompt: "vibrant and gradient-driven. Dark base, saturated purple-to-pink gradient accents, glassy cards, modern sans-serif.",
    },
  ];

  const SECTIONS = {
    hero:        { name: "Hero",         desc: "Headline, CTA & image",
                   line: (cta) => `Hero: a headline of eight words or fewer, a one-line subhead, and a primary button labeled "${cta}". Image or product mockup on the right.` },
    social:      { name: "Social Proof", desc: "Client logos & trust",
                   line: () => "Social proof: one compact row of four to six client logos with a short trust line. No padding it out." },
    features:    { name: "Features",     desc: "Benefits grid",
                   line: () => "Features grid: three to six cards, each with an icon, a short heading, and one plain sentence about what the customer gets. Outcomes, not specs." },
    how:         { name: "How It Works", desc: "3-step process",
                   line: () => "How it works: three numbered steps showing the customer journey, each with a title and one line. Connect them visually." },
    testimonials:{ name: "Testimonials", desc: "Quotes & names",
                   line: () => "Testimonials: two or three short quotes with names and roles. Specific beats glowing." },
    pricing:     { name: "Pricing",      desc: "Plan comparison",
                   line: () => "Pricing: two or three tiers side by side with plan name, price, feature list, and a button. Mark the recommended one." },
    faq:         { name: "FAQ",          desc: "Common questions",
                   line: () => "FAQ accordion: five or six questions a real customer in this niche would actually ask." },
    contact:     { name: "Contact Form", desc: "Name, email, message",
                   line: () => "Contact form: name, email, message, submit. Validate input and confirm submission clearly." },
    newsletter:  { name: "Newsletter",   desc: "Email capture",
                   line: () => "Newsletter signup: one sentence on what subscribers get, an inline email field, and a subscribe button." },
    stats:       { name: "Stats",        desc: "Numbers that back it up",
                   line: () => "Stats row: three or four specific numbers with labels. Real figures the business can stand behind, not filler." },
    cta:         { name: "CTA Banner",   desc: "Closing call to action",
                   line: (cta) => `Closing CTA banner: full width, one-line restatement of the offer, and the "${cta}" button one last time before the footer.` },
    footer:      { name: "Footer",       desc: "Links & socials",
                   line: () => "Footer: logo, link columns, socials, copyright. Keep it quiet." },
  };

  const DEFAULT_PAGE = ["hero", "social", "features", "footer"];
  const ADDABLE = ["how", "testimonials", "pricing", "faq", "contact", "newsletter", "stats", "cta"];
  const DEFAULT_CTA = "Get a quote";

  // ---------- State ----------

  const state = {
    purpose: "",
    business: "",
    businessCustom: "",
    audience: "",
    objections: "",
    style: STYLES[0],
    page: DEFAULT_PAGE.slice(),
  };

  // ---------- Elements ----------

  const el = {
    purpose: document.getElementById("purpose"),
    businessChips: document.getElementById("business-chips"),
    businessCustom: document.getElementById("business-custom"),
    audience: document.getElementById("audience"),
    objections: document.getElementById("objections"),
    tabBuild: document.getElementById("tab-build"),
    tabResearch: document.getElementById("tab-research"),
    noteBuild: document.getElementById("note-build"),
    noteResearch: document.getElementById("note-research"),
    styleGrid: document.getElementById("style-grid"),
    sectionList: document.getElementById("section-list"),
    addChips: document.getElementById("add-chips"),
    ctaText: document.getElementById("cta-text"),
    output: document.getElementById("prompt-output"),
    wordCount: document.getElementById("word-count"),
    promptBox: document.getElementById("prompt-box"),
    expandBtn: document.getElementById("expand-btn"),
    copyBtn: document.getElementById("copy-btn"),
  };

  // ---------- Business chips ----------

  BUSINESS_TYPES.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      state.business = state.business === label ? "" : label;
      el.businessCustom.value = "";
      state.businessCustom = "";
      renderChips();
      renderPrompt();
    });
    el.businessChips.appendChild(btn);
  });

  function renderChips() {
    [...el.businessChips.children].forEach((chip) => {
      chip.classList.toggle("selected", chip.textContent === state.business);
    });
  }

  el.businessCustom.addEventListener("input", () => {
    state.businessCustom = el.businessCustom.value.trim();
    if (state.businessCustom) {
      state.business = "";
      renderChips();
    }
    renderPrompt();
  });

  // ---------- Style cards ----------

  const PREVIEW_HTML = `
    <span class="preview">
      <span class="p-nav">
        <i class="p-logo"></i>
        <span class="p-links"><i></i><i></i><i></i></span>
      </span>
      <i class="p-h1"></i>
      <i class="p-line l1"></i>
      <i class="p-line l2"></i>
      <i class="p-btn"></i>
      <span class="p-cards">
        <span class="p-card"><i class="ic"></i><i class="t1"></i><i class="t2"></i></span>
        <span class="p-card"><i class="ic"></i><i class="t1"></i><i class="t2"></i></span>
        <span class="p-card"><i class="ic"></i><i class="t1"></i><i class="t2"></i></span>
      </span>
    </span>`;

  STYLES.forEach((style) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `style-card prev-${style.id}`;
    btn.innerHTML = PREVIEW_HTML + `<span class="label">${style.label}</span>`;
    if (style.id === state.style.id) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.style = style;
      [...el.styleGrid.children].forEach((c) => c.classList.remove("selected"));
      btn.classList.add("selected");
      renderPrompt();
    });
    el.styleGrid.appendChild(btn);
  });

  // ---------- Section list ----------

  let dragIndex = null;

  function renderSections() {
    el.sectionList.innerHTML = "";

    state.page.forEach((key, i) => {
      const s = SECTIONS[key];
      const li = document.createElement("li");
      li.className = "section-item";
      li.draggable = true;
      li.dataset.key = key;

      li.innerHTML = `
        <span class="grip" aria-hidden="true">⠿</span>
        <span class="s-body">
          <span class="s-name">${s.name}</span><span class="s-desc">${s.desc}</span>
        </span>
        <span class="move-col">
          <button type="button" class="move-btn up" aria-label="Move ${s.name} up" ${i === 0 ? "disabled" : ""}>▲</button>
          <button type="button" class="move-btn down" aria-label="Move ${s.name} down" ${i === state.page.length - 1 ? "disabled" : ""}>▼</button>
        </span>
        <span class="s-index">${i + 1}</span>
        <button type="button" class="remove-btn" aria-label="Remove ${s.name}">✕</button>`;

      li.querySelector(".remove-btn").addEventListener("click", () => {
        withFlip(() => state.page.splice(i, 1));
        renderAddChips();
        renderPrompt();
      });
      li.querySelector(".move-btn.up").addEventListener("click", () => moveSection(i, i - 1));
      li.querySelector(".move-btn.down").addEventListener("click", () => moveSection(i, i + 1));

      li.addEventListener("dragstart", () => {
        dragIndex = i;
        requestAnimationFrame(() => li.classList.add("dragging"));
      });
      li.addEventListener("dragend", () => {
        dragIndex = null;
        li.classList.remove("dragging");
      });
      li.addEventListener("dragover", (e) => e.preventDefault());
      li.addEventListener("drop", (e) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === i) return;
        moveSection(dragIndex, i);
      });

      el.sectionList.appendChild(li);
    });
  }

  function moveSection(from, to) {
    if (to < 0 || to >= state.page.length) return;
    withFlip(() => {
      const [moved] = state.page.splice(from, 1);
      state.page.splice(to, 0, moved);
    });
    renderPrompt();
  }

  // FLIP: measure item positions, mutate and re-render, then animate each
  // item from its old position to its new one. New items scale in.
  function withFlip(mutate) {
    if (reducedMotion) {
      mutate();
      renderSections();
      return;
    }
    const first = {};
    el.sectionList.querySelectorAll(".section-item").forEach((li) => {
      first[li.dataset.key] = li.getBoundingClientRect().top;
    });
    mutate();
    renderSections();
    el.sectionList.querySelectorAll(".section-item").forEach((li) => {
      const was = first[li.dataset.key];
      const now = li.getBoundingClientRect().top;
      if (was === undefined) {
        li.animate(
          [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "scale(1)" }],
          { duration: 220, easing: "ease-out" }
        );
      } else if (was !== now) {
        li.animate(
          [{ transform: `translateY(${was - now}px)` }, { transform: "translateY(0)" }],
          { duration: 220, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
        );
      }
    });
  }

  function renderAddChips() {
    el.addChips.innerHTML = "";
    ADDABLE.filter((key) => !state.page.includes(key)).forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip add";
      btn.textContent = SECTIONS[key].name;
      btn.addEventListener("click", () => {
        withFlip(() => {
          // insert before the footer if there is one, otherwise append
          const footerIdx = state.page.indexOf("footer");
          if (footerIdx === -1) state.page.push(key);
          else state.page.splice(footerIdx, 0, key);
        });
        renderAddChips();
        renderPrompt();
      });
      el.addChips.appendChild(btn);
    });
  }

  // ---------- Prompt ----------

  function objectionList() {
    return state.objections
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  }

  function buildPrompt() {
    const purpose = state.purpose || "[Describe your website or business here]";
    const business = state.businessCustom || state.business || "[Business type]";
    const cta = el.ctaText.value.trim() || DEFAULT_CTA;
    const objections = objectionList();

    const structure = state.page
      .map((key, i) => `${i + 1}. ${SECTIONS[key].line(cta)}`)
      .join("\n");

    const lines = [
      "Build me a complete, production-quality single-page website.",
      "",
      `**What it's for:** ${purpose}`,
      `**Business type:** ${business}`,
    ];
    if (state.audience) {
      lines.push(`**Who the visitor is:** ${state.audience} Write every line of copy for this person.`);
    }
    lines.push(`**Design direction:** ${state.style.prompt}`);
    if (objections.length) {
      lines.push("");
      lines.push("**Objections the copy must answer:**");
      objections.forEach((o) => lines.push(`- ${o}`));
    }
    lines.push(
      "",
      "**Page structure, top to bottom:**",
      structure,
      "",
      `**Primary call to action:** "${cta}". Put it above the fold and repeat it near the end. Same label everywhere.`,
      "",
      "**Constraints:**",
      "- Build it as a single page in React with Tailwind CSS. No routing.",
      "- Fully responsive. Check it at 375px, 768px, and 1280px.",
      "- Semantic HTML and readable contrast. No body text under 14px.",
      "- Write real copy for the business described above. No lorem ipsum."
    );
    if (objections.length) {
      lines.push("- Answer every objection listed above somewhere on the page. The FAQ is the natural home for most of them.");
    }
    lines.push(
      "- Subtle hover and scroll transitions are fine. Nothing that moves on its own.",
      "- One font family, two weights. One accent color, used consistently.",
      "- Every section earns its place. If it has nothing to say, leave it out."
    );
    return lines.join("\n");
  }

  function buildResearchPrompt() {
    const purpose = state.purpose || "[Describe your website or business here]";
    const business = state.businessCustom || state.business || "[Business type]";

    return [
      "Before I build a website, research what already works in this niche.",
      "",
      `**The site I'm planning:** ${purpose}`,
      `**Business type:** ${business}`,
      "",
      `Find five top-performing ${business} websites. Judge top performers by search ranking, review count and rating, and how clearly the site drives one action. Use your web search or scraping tools. If you cannot browse the web, say so and answer from what you know instead of guessing.`,
      "",
      "**Answer these five questions in short bullets, based on the top performers:**",
      "1. Who is the visitor these sites serve? Not the owner. The person landing on the page.",
      "2. What one action do they push that visitor toward?",
      "3. What objections do they answer, and where: FAQ, testimonials, guarantees?",
      "4. What visual style do they share: colors, photography, tone?",
      "5. What page sections show up on nearly all of them, and in what order?",
      "",
      "**Then return a build brief:** two sentences on purpose and audience, the primary call to action, the top three objections to answer, a style direction, and a section list in order. I will paste that brief into a website builder prompt.",
    ].join("\n");
  }

  let activeTab = "build";
  let lastPrompt = null;
  let lastWords = 0;
  let glowTimer = null;
  let countFrame = null;

  function activePrompt() {
    return activeTab === "build" ? buildPrompt() : buildResearchPrompt();
  }

  function setTab(tab) {
    if (tab === activeTab) return;
    activeTab = tab;
    el.tabBuild.classList.toggle("active", tab === "build");
    el.tabResearch.classList.toggle("active", tab === "research");
    el.tabBuild.setAttribute("aria-selected", String(tab === "build"));
    el.tabResearch.setAttribute("aria-selected", String(tab === "research"));
    el.noteBuild.classList.toggle("hidden", tab !== "build");
    el.noteResearch.classList.toggle("hidden", tab !== "research");
    lastPrompt = null; // switch without glow
    renderPrompt();
  }

  el.tabBuild.addEventListener("click", () => setTab("build"));
  el.tabResearch.addEventListener("click", () => setTab("research"));

  function renderPrompt() {
    const prompt = activePrompt();
    if (prompt === lastPrompt) return;
    const isFirst = lastPrompt === null;
    lastPrompt = prompt;
    el.output.textContent = prompt;

    const words = prompt.trim().split(/\s+/).length;
    if (isFirst || reducedMotion) {
      el.wordCount.textContent = `${words} words`;
    } else {
      tweenCount(lastWords, words);
      flashPromptBox();
    }
    lastWords = words;
  }

  function tweenCount(from, to) {
    if (countFrame) cancelAnimationFrame(countFrame);
    const t0 = performance.now();
    const dur = 250;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.wordCount.textContent = `${Math.round(from + (to - from) * eased)} words`;
      if (p < 1) countFrame = requestAnimationFrame(step);
    };
    countFrame = requestAnimationFrame(step);
  }

  function flashPromptBox() {
    el.promptBox.classList.add("updated");
    clearTimeout(glowTimer);
    glowTimer = setTimeout(() => el.promptBox.classList.remove("updated"), 500);
  }

  el.purpose.addEventListener("input", () => {
    state.purpose = el.purpose.value.trim();
    renderPrompt();
  });

  el.audience.addEventListener("input", () => {
    state.audience = el.audience.value.trim();
    renderPrompt();
  });

  el.objections.addEventListener("input", () => {
    state.objections = el.objections.value;
    renderPrompt();
  });

  el.ctaText.addEventListener("input", renderPrompt);

  // ---------- Expand / copy ----------

  el.expandBtn.addEventListener("click", () => {
    const expanded = el.promptBox.classList.toggle("expanded");
    el.expandBtn.textContent = expanded ? "Collapse" : "Expand";
  });

  el.copyBtn.addEventListener("click", async () => {
    const text = activePrompt();
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      ta.remove();
    }
    el.copyBtn.textContent = ok ? "Copied" : "Copy failed. Select and copy manually.";
    el.copyBtn.classList.toggle("copied", ok);
    setTimeout(() => {
      el.copyBtn.textContent = "Copy prompt";
      el.copyBtn.classList.remove("copied");
    }, 2000);
  });

  // ---------- Scroll reveals ----------

  if (!reducedMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll("main section").forEach((section) => {
      section.classList.add("reveal");
      io.observe(section);
    });
  }

  // ---------- Init ----------

  renderSections();
  renderAddChips();
  renderPrompt();
})();
