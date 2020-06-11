import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import { FormGroup, FormControl, Form, Col, Button } from 'react-bootstrap';
import { onError } from '../libs/errorLib';
import './Games.css';

export default function Games() {
	const { date_machine } = useParams();
	const history = useHistory();
	const [game, setGame] = useState(null);
	const [player1, setPlayer1] = useState('');
	const [player2, setPlayer2] = useState('');
	const [player3, setPlayer3] = useState('');
	const [player4, setPlayer4] = useState('');
	const [score1, setScore1] = useState(0);
	const [score2, setScore2] = useState(0);
	const [score3, setScore3] = useState(0);
	const [score4, setScore4] = useState(0);
	const [machine, setMachine] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		function loadGame() {
			return API.get('pinball-scoreboard', `/games/${date_machine}`);
		}

		async function onLoad() {
			try {
				const game = await loadGame();
				setPlayer1(game.players[0]);
				setPlayer2(game.players[1]);
				setPlayer3(game.players[2]);
				setPlayer4(game.players[3]);
				setScore1(game.scores[0]);
				setScore2(game.scores[1]);
				setScore3(game.scores[2]);
				setScore4(game.scores[3]);
				setMachine(game.date_machine.split('_')[1]);

				setGame(game);
			} catch (e) {
				onError(e);
			}
		}

		onLoad();
	}, [date_machine]);

	function validateForm() {
		if (!isNaN(score1) && !isNaN(score2) && !isNaN(score3) && !isNaN(score4)) {
			return score1 >= 0 && score2 >= 0 && score3 >= 0 && score4 >= 0;
		} else {
			return false;
		}
	}

	function saveGame(game) {
		return API.put('pinball-scoreboard', `/games/${date_machine}`, {
			body: game,
		});
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await saveGame({
				players: [player1, player2, player3, player4],
				scores: [parseInt(score1), parseInt(score2), parseInt(score3), parseInt(score4)],
			});
			history.push('/');
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	function deleteGame() {
		return API.del('pinball-scoreboard', `/games/${date_machine}`);
	}

	async function handleDelete(event) {
		event.preventDefault();

		const confirmed = window.confirm('Are you sure you want to delete this game?');

		if (!confirmed) {
			return;
		}

		setIsDeleting(true);

		try {
			await deleteGame();
			history.push('/');
		} catch (e) {
			onError(e);
			setIsDeleting(false);
		}
	}

	return (
		<div className="Games">
			{game && (
				<Form onSubmit={handleSubmit}>
					<Form.Row>
						<FormGroup as={Col} controlId="player1Score">
							<Form.Label className="game-score-label">{player1}</Form.Label>
							<FormControl value={score1} type="text" onChange={(e) => setScore1(e.target.value)} />
						</FormGroup>
						<FormGroup as={Col} controlId="player2Score">
							<Form.Label className="game-score-label">{player2}</Form.Label>
							<FormControl value={score2} type="number" onChange={(e) => setScore2(e.target.value)} />
						</FormGroup>
					</Form.Row>
					<Form.Row>
						<FormGroup as={Col} controlId="player3Score">
							<Form.Label className="game-score-label">{player3}</Form.Label>
							<FormControl value={score3} type="text" onChange={(e) => setScore3(e.target.value)} />
						</FormGroup>
						<FormGroup as={Col} controlId="player4Score">
							<Form.Label className="game-score-label">{player4}</Form.Label>
							<FormControl value={score4} type="number" onChange={(e) => setScore4(e.target.value)} />
						</FormGroup>
					</Form.Row>

					<FormGroup controlId="machine">
						<Form.Label>Machine</Form.Label>
						<FormControl value={machine} type="text" width="100%" readOnly />
					</FormGroup>
					<Button
						block
						type="submit"
						vaiant="primary"
						onClick={isLoading ? handleSubmit : null}
						disabled={!validateForm()}
						width="100%"
					>
						{isLoading ? 'Loading…' : 'Save'}
					</Button>
					<Button block variant="danger" width="100%" onClick={handleDelete}>
						{isDeleting ? 'Loading…' : 'Delete'}
					</Button>
				</Form>
			)}
		</div>
	);
}
