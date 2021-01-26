import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import "@vonagevolta/volta2/dist/css/volta.min.css";

import App from './App';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { SessionProvider } from "components/SessionProvider"

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <ThemeProvider theme={createMuiTheme()}>
          <App />
        </ThemeProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
