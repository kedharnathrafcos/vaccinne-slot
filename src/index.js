
import React from 'react';
import 'react-app-polyfill/ie9';
    import 'react-app-polyfill/ie11';
    import 'react-app-polyfill/stable';
    import 'core-js/stable';
import ReactDOM from 'react-dom'; 
import { Provider } from 'react-redux';

import store from "./redux/store";
import App from './components/App'; 
ReactDOM.render(
    <React.StrictMode> 
        <Provider  store={store}>
        <App /> 
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );