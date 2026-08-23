import common from './common.js';

const langDisplayMap = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
  ko: '한국어'
};

let currentPageTranslations = {};

export function getSavedLang() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('alphaVisionLang') : null;
  return saved && common[saved] ? saved : 'zh';
}

export function saveLang(lang) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('alphaVisionLang', lang);
  }
}

export function getLangLabel(lang) {
  return langDisplayMap[lang] || '中文';
}

function getMergedTranslations(lang) {
  const commonTranslations = common[lang] || common.zh;
  const pageTranslations = currentPageTranslations[lang] || {};
  return {
    ...commonTranslations,
    ...pageTranslations
  };
}

export function translatePage(lang) {
  const translations = getMergedTranslations(lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && translations[key]) el.textContent = translations[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key && translations[key]) el.innerHTML = translations[key];
  });
}

export function initTranslation(pageTranslations = {}) {
  currentPageTranslations = pageTranslations || {};
  let currentLang = getSavedLang();
  translatePage(currentLang);
  const display = document.getElementById('currentLangDisplay');
  if (display) display.textContent = getLangLabel(currentLang);

  window.changeLanguage = function(lang) {
    if (!common[lang]) return;
    currentLang = lang;
    saveLang(lang);
    translatePage(lang);
    const langDisplay = document.getElementById('currentLangDisplay');
    if (langDisplay) langDisplay.textContent = getLangLabel(lang);
  };
}
