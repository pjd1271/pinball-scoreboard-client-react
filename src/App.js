import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
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
				<Navbar bg="dark" variant="dark" expand="lg">
					{/* <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"> */}
					<LinkContainer to="/">
						<Navbar.Brand>SCOREBOARD</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />

					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							{isAuthenticated ? (
								<Nav.Link onClick={handleLogout}>Logout</Nav.Link>
							) : (
								<>
									<LinkContainer to="/signup">
										<Nav.Link>Signup</Nav.Link>
									</LinkContainer>
									<LinkContainer to="/login">
										<Nav.Link>Login</Nav.Link>
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
