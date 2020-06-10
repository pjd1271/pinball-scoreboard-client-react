import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import { API } from 'aws-amplify';

import { onError } from '../libs/errorLib';
import machinesArray from '../machinesArray';
import './NewGame.css';

export default function NewGame() {
	const sortedMachinesArray = machinesArray.sort();
	const history = useHistory();
	const [player1, setPlayer1] = useState('');
	const [player2, setPlayer2] = useState('');
	const [player3, setPlayer3] = useState('');
	const [player4, setPlayer4] = useState('');
	const [machine, setMachine] = useState(sortedMachinesArray[0]);
	const [isLoading, setIsLoading] = useState(false);

	function validateForm() {
		return player1.length > 0 && player2.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await createGame({
				machine,
				player1,
				player2,
				player3,
				player4,
				score1: 0,
				score2: 0,
				score3: 0,
				score4: 0,
			});
			history.push('/');
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	function createGame(game) {
		return API.post('pinball-scoreboard', '/games', {
			body: game,
		});
	}

	return (
		<div className="NewGame">
			<form onSubmit={handleSubmit}>
				<FormGroup controlId="player1">
					<Form.Label>Player 1</Form.Label>
					<FormControl value={player1} type="text" onChange={(e) => setPlayer1(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player2">
					<Form.Label>Player 2</Form.Label>
					<FormControl value={player2} type="text" onChange={(e) => setPlayer2(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player3">
					<Form.Label>Player 3</Form.Label>
					<FormControl value={player3} type="text" onChange={(e) => setPlayer3(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player4">
					<Form.Label>Player 4</Form.Label>
					<FormControl value={player4} type="text" onChange={(e) => setPlayer4(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="machine">
					<Form.Label>machine</Form.Label>
					<FormControl value={machine} as="select" onChange={(e) => setMachine(e.target.value)}>
						{sortedMachinesArray.map((machine, index) => {
							return (
								<option key={index} value={machine}>
									{machine}
								</option>
							);
						})}
					</FormControl>
				</FormGroup>
				<Button block type="submit" onClick={isLoading ? handleSubmit : null} disabled={!validateForm()}>
					{isLoading ? 'Loading…' : 'Create'}
				</Button>
			</form>
		</div>
	);
}
