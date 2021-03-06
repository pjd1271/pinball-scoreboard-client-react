import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import NotFound from './containers/NotFound';
import NewGame from './containers/NewGame';
import Games from './containers/Games';

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Home />
			</Route>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route exact path="/signup">
				<Signup />
			</Route>
			<Route exact path="/games/new">
				<NewGame />
			</Route>
			<Route exact path="/games/:date_machine">
				<Games />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}
