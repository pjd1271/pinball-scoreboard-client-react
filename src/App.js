import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Badge, Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';

import Routes from './Routes';
import { AppContext } from './libs/contextLib';
import { onError } from './libs/errorLib';
import './App.css';

function App() {
	const history = useHistory();
	const [isAuthenticating, setIsAuthenticating] = useState(true);
	const [isAuthenticated, userHasAuthenticated] = useState(false);

	useEffect(() => {
		onLoad();
	}, []);

	async function onLoad() {
		try {
			await Auth.currentSession();
			userHasAuthenticated(true);
		} catch (e) {
			if (e !== 'No current user') {
				onError(e);
			}
		}

		setIsAuthenticating(false);
	}

	async function handleLogout() {
		await Auth.signOut();

		userHasAuthenticated(false);

		history.push('/login');
	}

	return (
		!isAuthenticating && (
			<div className="App container">
				<Navbar inverse fluid collapseOnSelect>
					<Navbar.Header>
						<Navbar.Brand>
							<Link to="/">
								SCOREBOARD <Badge>0</Badge>
							</Link>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight>
							{isAuthenticated ? (
								<NavItem onClick={handleLogout}>Logout</NavItem>
							) : (
								<>
									<LinkContainer to="/signup">
										<NavItem>Signup</NavItem>
									</LinkContainer>
									<LinkContainer to="/login">
										<NavItem>Login</NavItem>
									</LinkContainer>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
					<Routes />
				</AppContext.Provider>
			</div>
		)
	);
}

export default App;
