import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Container, Row, Col } from 'react-bootstrap';
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
					<ListGroupItem>
						<Container>
							<Row>
								<Col xs={4}>
									<div className="games-list-header">{game.date_machine.split('_')[1]}</div>
								</Col>
								<Col>
									<div className="games-list-player">{game.players[0]}</div>
								</Col>
								<Col>
									<div className="games-list-player">{game.players[1]}</div>
								</Col>
								<Col>
									<div className="games-list-player">{game.players[2]}</div>
								</Col>
								<Col>
									<div className="games-list-player">{game.players[3]}</div>
								</Col>
							</Row>
							<Row>
								<Col xs={4}>
									<div>
										{'Created: ' +
											new Date(parseInt(game.date_machine.split('_')[0])).toLocaleString()}
									</div>
								</Col>
								<Col>
									<div className="games-list-score">{game.scores[0].toLocaleString()}</div>
								</Col>
								<Col>
									<div className="games-list-score">{game.scores[1].toLocaleString()}</div>
								</Col>
								<Col>
									<div className="games-list-score">{game.scores[2].toLocaleString()}</div>
								</Col>
								<Col>
									<div className="games-list-score">{game.scores[3].toLocaleString()}</div>
								</Col>
							</Row>
						</Container>
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
				<h2>Your Games</h2>
				<ListGroup>{!isLoading && renderGamesList(games)}</ListGroup>
			</div>
		);
	}

	return <div className="Home">{isAuthenticated ? renderGames() : renderLander()}</div>;
}
