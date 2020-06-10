import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
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
				console.log(game);
				setPlayer1(game.players[0]);
				setPlayer2(game.players[1]);
				setPlayer3(game.players[2]);
				setPlayer4(game.players[3]);
				setScore1(game.scores[0]);
				setScore2(game.scores[1]);
				setScore3(game.scores[2]);
				setScore4(game.scores[3]);
				setMachine(game.date_machine.split('_')[1]);

				//     const { content, attachment } = note;

				//     setContent(content);
				setGame(game);
			} catch (e) {
				onError(e);
			}
		}

		onLoad();
	}, [date_machine]);

	function validateForm() {
		return player1.length > 0 && score1.length > 0 && score2.length > 0 && score3.length > 0 && score4.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);
	}

	async function handleDelete(event) {
		event.preventDefault();

		const confirmed = window.confirm('Are you sure you want to delete this game?');

		if (!confirmed) {
			return;
		}

		setIsDeleting(true);
	}

	return (
		<div className="Games">
			{game && (
				<form inline="true" onSubmit={handleSubmit}>
					<FormGroup controlId="player1">
						<ControlLabel>Player 1</ControlLabel>
						<FormControl value={player1} type="text" onChange={(e) => setPlayer1(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="score1">
						<ControlLabel>Player 1 Score</ControlLabel>
						<FormControl value={score1} type="number" onChange={(e) => setScore1(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="player2">
						<ControlLabel>Player 2</ControlLabel>
						<FormControl value={player2} type="text" onChange={(e) => setPlayer2(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="score2">
						<ControlLabel>Player 2 Score</ControlLabel>
						<FormControl value={score2} type="number" onChange={(e) => setScore2(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="player3">
						<ControlLabel>Player 3</ControlLabel>
						<FormControl value={player3} type="text" onChange={(e) => setPlayer3(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="score3">
						<ControlLabel>Player 3 Score</ControlLabel>
						<FormControl value={score3} type="number" onChange={(e) => setScore3(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="player4">
						<ControlLabel>Player 4</ControlLabel>
						<FormControl value={player4} type="text" onChange={(e) => setPlayer4(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="score4">
						<ControlLabel>Player 4 Score</ControlLabel>
						<FormControl value={score4} type="number" onChange={(e) => setScore4(e.target.value)} />
					</FormGroup>{' '}
					<FormGroup controlId="machine">
						<ControlLabel>Machine</ControlLabel>
						<FormControl value={machine} type="text" width="100%" readOnly />
					</FormGroup>{' '}
					<LoaderButton
						block
						type="submit"
						bsSize="large"
						bsStyle="primary"
						isLoading={isLoading}
						disabled={!validateForm()}
						width="100%"
					>
						Save
					</LoaderButton>
					<LoaderButton
						block
						bsSize="large"
						bsStyle="danger"
						width="100%"
						onClick={handleDelete}
						isLoading={isDeleting}
					>
						Delete
					</LoaderButton>
				</form>
			)}
		</div>
	);
}
