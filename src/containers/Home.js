import React, { useState, useEffect } from 'react';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { API } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import './Home.css';

export default function Home() {
	const [games, setGames] = useState([]);
	const { isAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function onLoad() {
			if (!isAuthenticated) {
				return;
			}

			try {
				const games = await loadGames();
				setGames(games);
			} catch (e) {
				onError(e);
			}

			setIsLoading(false);
		}

		onLoad();
	}, [isAuthenticated]);

	function loadGames() {
		return API.get('pinball-scoreboard', '/games');
	}

	function renderGamesList(games) {
		return [{}].concat(games).map((game, i) =>
			i !== 0 ? (
				<LinkContainer key={game.gameId} to={`/games/${game.date_machine}`}>
					<ListGroupItem header={game.date_machine.split('_')[1]}>
						{'Created: ' + new Date(parseInt(game.date_machine.split('_')[0])).toLocaleString()}
					</ListGroupItem>
				</LinkContainer>
			) : (
				<LinkContainer key="new" to="/games/new">
					<ListGroupItem>
						<h4>
							<b>{'\uFF0B'}</b> Create a new game
						</h4>
					</ListGroupItem>
				</LinkContainer>
			)
		);
	}

	function renderLander() {
		return (
			<div className="lander">
				<h1>Pinball Scoreboard</h1>
				<p>A place to store and share your league and tourney scores</p>
			</div>
		);
	}

	function renderGames() {
		return (
			<div className="games">
				<PageHeader>Your Games</PageHeader>
				<ListGroup>{!isLoading && renderGamesList(games)}</ListGroup>
			</div>
		);
	}

	return <div className="Home">{isAuthenticated ? renderGames() : renderLander()}</div>;
}
