import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './containers/Login';
import Signup from './containers/Signup';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import NewGame from './containers/NewGame';
import Games from './containers/Games';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<UnauthenticatedRoute exact path="/login">
				<Login />
			</UnauthenticatedRoute>
			<UnauthenticatedRoute exact path="/signup">
				<Signup />
			</UnauthenticatedRoute>
			<AuthenticatedRoute exact path="/games/new">
				<NewGame />
			</AuthenticatedRoute>
			<AuthenticatedRoute exact path="/games/:date_machine">
				<Games />
			</AuthenticatedRoute>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}
