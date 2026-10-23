// Menu mobilne
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

// Zamknij menu po kliknięciu w link
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Zegar na ekranie blokady w górze strony: prawdziwa godzina i data, jak na telefonie
const timeFormat = new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "numeric", month: "short" });

function tickClock() {
  const now = new Date();
  document.querySelectorAll("[data-now-time]").forEach((el) => { el.textContent = timeFormat.format(now); });
  document.querySelectorAll("[data-now-date]").forEach((el) => { el.textContent = dateFormat.format(now); });
}

tickClock();
setInterval(tickClock, 15000);

// Przymiarka wyglądu: wybrany szablon trafia na wszystkie ekrany z data-follow
const templateNames = {
  ivory: "Pergamin",
  midnight: "Nocne niebo",
  sunset: "Zachód słońca",
  washi: "Tusz i papier",
  digital_rain: "Cyfrowy deszcz",
};

function setTemplate(id) {
  document.querySelectorAll(".ls[data-follow]").forEach((el) => { el.dataset.tpl = id; });
  document.querySelectorAll("[data-set-tpl]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.setTpl === id));
  });
  document.querySelectorAll("[data-tpl-name]").forEach((el) => { el.textContent = templateNames[id]; });
}

document.querySelectorAll("[data-set-tpl]").forEach((btn) => {
  btn.addEventListener("click", () => setTemplate(btn.dataset.setTpl));
});

// Tapeta podmienia słowo co kilka sekund — prawdziwe fiszki z talii w aplikacji
const sampleCards = [
  ["finally", "/ˈfaɪnəli/", "w końcu, wreszcie"],
  ["understand", "/ˌʌndɚˈstænd/", "rozumieć / pojmować"],
  ["siempre", "", "zawsze"],
  ["remember", "/ɹɪˈmɛmbɚ/", "pamiętać / przypominać sobie"],
  ["happen", "/ˈhæpən/", "zdarzać się / dziać się"],
  ["Kazachstan", "", "Astana"],
  ["weather", "/ˈwɛðɚ/", "pogoda / przetrwać (kryzys)"],
  ["aprender", "", "uczyć się"],
  ["improve", "/ɪmˈpɹuːv/", "poprawiać, ulepszać"],
];

const rotating = document.querySelector(".ls[data-rotate]");

if (rotating && !reducedMotion) {
  const text = rotating.querySelector(".ls-text");
  const word = rotating.querySelector(".ls-word");
  const ipa = rotating.querySelector(".ls-ipa");
  const tr = rotating.querySelector(".ls-tr");
  let index = 0;
  let onScreen = true;

  new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(rotating);

  setInterval(() => {
    if (!onScreen || document.hidden) return;
    index = (index + 1) % sampleCards.length;
    const [w, p, t] = sampleCards[index];
    text.classList.add("is-swapping");
    setTimeout(() => {
      word.textContent = w;
      ipa.textContent = p;
      ipa.hidden = p === "";
      tr.textContent = t;
      text.classList.remove("is-swapping");
    }, 350);
  }, 4500);
}

// Animacje wejścia przy przewijaniu
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
