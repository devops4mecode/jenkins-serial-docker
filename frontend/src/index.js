import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "context/authContext";

import { IntlProvider } from "react-intl";
import English from "locale/en.json"
import Chinese from "locale/zh.json"
import Malay from "locale/ms.json"

const locale = typeof window != 'undefined' ? navigator.language : 'en'
let lang;
if (locale === "en") {
  lang = English
} else {
  if (locale === "zh") {
    lang = Chinese
  } else {
    lang = Malay
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IntlProvider locale={locale} messages={English}>
    <React.StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </React.StrictMode>
  </IntlProvider>
);
