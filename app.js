/* Website Selector — Voss Systems
   All state lives in memory. Nothing is sent anywhere, nothing is stored. */

(function () {
  "use strict";

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
    style: STYLES[0],
    page: DEFAULT_PAGE.slice(),
  };

  // ---------- Elements ----------

  const el = {
    purpose: document.getElementById("purpose"),
    businessChips: document.getElementById("business-chips"),
    businessCustom: document.getElementById("business-custom"),
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
        state.page.splice(i, 1);
        renderSections();
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
    const [moved] = state.page.splice(from, 1);
    state.page.splice(to, 0, moved);
    renderSections();
    renderPrompt();
  }

  function renderAddChips() {
    el.addChips.innerHTML = "";
    ADDABLE.filter((key) => !state.page.includes(key)).forEach((key) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip add";
      btn.textContent = SECTIONS[key].name;
      btn.addEventListener("click", () => {
        // insert before the footer if there is one, otherwise append
        const footerIdx = state.page.indexOf("footer");
        if (footerIdx === -1) state.page.push(key);
        else state.page.splice(footerIdx, 0, key);
        renderSections();
        renderAddChips();
        renderPrompt();
      });
      el.addChips.appendChild(btn);
    });
  }

  // ---------- Prompt ----------

  function buildPrompt() {
    const purpose = state.purpose || "[Describe your website or business here]";
    const business = state.businessCustom || state.business || "[Business type]";
    const cta = el.ctaText.value.trim() || DEFAULT_CTA;

    const structure = state.page
      .map((key, i) => `${i + 1}. ${SECTIONS[key].line(cta)}`)
      .join("\n");

    return [
      "Build me a complete, production-quality single-page website.",
      "",
      `**What it's for:** ${purpose}`,
      `**Business type:** ${business}`,
      `**Design direction:** ${state.style.prompt}`,
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
      "- Write real copy for the business described above. No lorem ipsum.",
      "- Subtle hover and scroll transitions are fine. Nothing that moves on its own.",
      "- One font family, two weights. One accent color, used consistently.",
      "- Every section earns its place. If it has nothing to say, leave it out.",
    ].join("\n");
  }

  function renderPrompt() {
    const prompt = buildPrompt();
    el.output.textContent = prompt;
    const words = prompt.trim().split(/\s+/).length;
    el.wordCount.textContent = `${words} words`;
  }

  el.purpose.addEventListener("input", () => {
    state.purpose = el.purpose.value.trim();
    renderPrompt();
  });

  el.ctaText.addEventListener("input", renderPrompt);

  // ---------- Expand / copy ----------

  el.expandBtn.addEventListener("click", () => {
    const expanded = el.promptBox.classList.toggle("expanded");
    el.expandBtn.textContent = expanded ? "Collapse" : "Expand";
  });

  el.copyBtn.addEventListener("click", async () => {
    const text = buildPrompt();
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

  // ---------- Init ----------

  renderSections();
  renderAddChips();
  renderPrompt();
})();
