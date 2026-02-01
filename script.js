// Mobile menu
const burger = document.querySelector("[data-burger]");
const mobile = document.querySelector("[data-mobile]");
if (burger && mobile) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobile.hidden = expanded;
  });

  mobile.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    burger.setAttribute("aria-expanded", "false");
    mobile.hidden = true;
  });
}

// Tabs
const tabsRoot = document.querySelector("[data-tabs]");
if (tabsRoot) {
  const buttons = Array.from(tabsRoot.querySelectorAll("[data-tab]"));
  const panes = Array.from(tabsRoot.querySelectorAll("[data-pane]"));

  const setActive = (key) => {
    buttons.forEach((b) => {
      const is = b.dataset.tab === key;
      b.classList.toggle("is-active", is);
      b.setAttribute("aria-selected", String(is));
    });
    panes.forEach((p) => p.classList.toggle("is-active", p.dataset.pane === key));
  };

  buttons.forEach((b) => b.addEventListener("click", () => setActive(b.dataset.tab)));
}

// Toast on "submit"
const toastBtn = document.querySelector("[data-toast]");
const toastUI = document.querySelector("[data-toast-ui]");
const toastClose = document.querySelector("[data-toast-close]");
if (toastBtn && toastUI) {
  toastBtn.addEventListener("click", () => {
    toastUI.hidden = false;
  });
}
if (toastClose && toastUI) {
  toastClose.addEventListener("click", () => {
    toastUI.hidden = true;
  });
}
if (toastUI) {
  toastUI.addEventListener("click", (e) => {
    if (e.target === toastUI) toastUI.hidden = true;
  });
}

// Footer year
const y = document.getElementById("y");
if (y) y.textContent = new Date().getFullYear();

// ===== Services bundle picker =====
const serviceCards = Array.from(document.querySelectorAll(".card--select[data-service]"));
const bundle = document.querySelector("[data-bundle]");
const bundleCount = document.querySelector("[data-bundle-count]");
const bundleChips = document.querySelector("[data-bundle-chips]");
const bundleClear = document.querySelector("[data-bundle-clear]");
const servicesField = document.querySelector("[data-services-field]");
const addServiceButtons = Array.from(document.querySelectorAll("[data-add-service]"));

const selected = new Set();

function syncBundleUI() {
  const items = Array.from(selected);

  // show/hide bundle
  if (bundle) bundle.hidden = items.length === 0;

  // count
  if (bundleCount) bundleCount.textContent = String(items.length);

  // chips
  if (bundleChips) {
    bundleChips.innerHTML = "";
    items.forEach((name) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.innerHTML = `<span>${name}</span><button type="button" aria-label="Убрать">×</button>`;
      chip.querySelector("button").addEventListener("click", () => {
        selected.delete(name);
        // uncheck card if exists
        const card = serviceCards.find(c => c.dataset.service === name);
        if (card) {
          const cb = card.querySelector(".pick__cb");
          if (cb) cb.checked = false;
          card.classList.remove("is-picked");
        }
        syncBundleUI();
      });
      bundleChips.appendChild(chip);
    });
  }

  // hidden field
  if (servicesField) servicesField.value = items.join(", ");

  // Also prefill message textarea gently (optional)
  const msg = document.querySelector('textarea[name="msg"]');
  if (msg) {
    const header = items.length ? `Выбранные услуги: ${items.join(", ")}\n\n` : "";
    // не перетирать ручной текст пользователя: добавляем/обновляем только "шапку"
    const current = msg.value || "";
    const withoutHeader = current.replace(/^Выбранные услуги:.*\n\n/s, "");
    msg.value = header + withoutHeader;
  }
}

serviceCards.forEach((card) => {
  const name = card.dataset.service;
  const cb = card.querySelector(".pick__cb");
  const pick = card.querySelector(".pick");

  const toggle = (checked) => {
    if (checked) selected.add(name);
    else selected.delete(name);
    card.classList.toggle("is-picked", checked);
    syncBundleUI();
  };

  // click label/checkbox
  if (cb) {
    cb.addEventListener("change", () => toggle(cb.checked));
  }

  // click on card (but not links/buttons)
  card.addEventListener("click", (e) => {
    const interactive = e.target.closest("a, button, input, label");
    if (interactive && !interactive.classList.contains("pick")) return;
    if (!cb) return;
    cb.checked = !cb.checked;
    toggle(cb.checked);
  });
});

// Add-service buttons (e.g. Import with VAT)
addServiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.addService;
    if (!name) return;
    selected.add(name);
    // if there is a matching card — mark it
    const card = serviceCards.find(c => c.dataset.service === name);
    if (card) {
      const cb = card.querySelector(".pick__cb");
      if (cb) cb.checked = true;
      card.classList.add("is-picked");
    }
    syncBundleUI();
    // scroll to bundle so user sees selection
    const b = document.getElementById("bundle");
    if (b) b.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

if (bundleClear) {
  bundleClear.addEventListener("click", () => {
    selected.clear();
    serviceCards.forEach((c) => {
      c.classList.remove("is-picked");
      const cb = c.querySelector(".pick__cb");
      if (cb) cb.checked = false;
    });
    syncBundleUI();
  });
}

// Make sure initial state is clean
syncBundleUI();

// Optional: on submit, require at least one selected
const leadForm = document.querySelector("#lead form");
if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    if (selected.size === 0) {
      e.preventDefault();
      alert("Выберите хотя бы одну услугу в разделе «Собери нужный набор».");
    }
  });
}
