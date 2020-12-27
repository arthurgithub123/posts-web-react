import React from 'react';

import { Switch } from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/signin" component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate={true} />
  </Switch>
);

export default Routes;