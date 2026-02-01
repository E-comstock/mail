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
