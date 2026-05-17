export const translations = {
  en: {
    settingsTitle: "Plugin Settings",
    dateFormat: "Date & Time Format",
    dateFormatDesc: "Example: YYYY-MM-DD HH:mm",
    metadataPrefix: "Metadata block prefix",
    metadataPrefixDesc: "Example: meta → ```meta"
  },

  ru: {
    settingsTitle: "Настройки плагина",
    dateFormat: "Формат даты и времени",
    dateFormatDesc: "Например: YYYY-MM-DD HH:mm",
    metadataPrefix: "Префикс блока метаданных",
    metadataPrefixDesc: "Например: meta → ```meta"
  }
};

export function getCurrentLanguage() {
  const lang = window.navigator.language;

  if (lang.startsWith("ru")) return "ru";
  return "en";
}

export function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations["en"][key] || key;
}