import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// TODO: evaluate if this is needed
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  pt: {
    translation: {
      script: {
        block: {
          title: "Tipo de Bloco",
          types: {
            "ok-nok": "Ok/Nok",
            "open-question": "Pergunta Aberta",
            "deep-knowledge": "Conhecimento Profundo",
          },
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
