//Entry point at main.js
/*This file will be the entry point to render the complete React app, as already
indicated in the client-side Webpack configuration object. Here, we import the root
or top-level React component(App) that will contain the whole frontend and render it to
the div element with the 'root' ID specified in the HTML document in template.js.*/

import React from 'react';
import { hydrate } from 'react-dom';

import App from './App';

hydrate(<App/>, document.getElementById('root'))