import React from 'react';

import GlobalCssStyles from './globalCssStyles/global';

import { BrowserRouter } from 'react-router-dom';
import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
  <BrowserRouter>
    <AppProvider>
      <Routes />
    </AppProvider>
    <GlobalCssStyles />
  </BrowserRouter>
);

export default App;
