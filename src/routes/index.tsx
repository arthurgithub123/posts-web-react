import React from 'react';

import { Switch } from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import CreatePost from '../pages/Post/Create';
import ListPost from '../pages/Post/List';
import EditPost from '../pages/Post/Edit';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/signin" component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate={true} />
    <Route path="/posts/create" component={CreatePost} isPrivate={true} />
    <Route path="/posts/list" component={ListPost} isPrivate={true} />
    <Route path="/posts/edit/:id" component={EditPost} isPrivate={true} />
  </Switch>
);

export default Routes;