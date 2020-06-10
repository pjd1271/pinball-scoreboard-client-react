import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { API } from 'aws-amplify';

import LoaderButton from '../components/LoaderButton';
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
					<ControlLabel>Player 1</ControlLabel>
					<FormControl value={player1} type="text" onChange={(e) => setPlayer1(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player2">
					<ControlLabel>Player 2</ControlLabel>
					<FormControl value={player2} type="text" onChange={(e) => setPlayer2(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player3">
					<ControlLabel>Player 3</ControlLabel>
					<FormControl value={player3} type="text" onChange={(e) => setPlayer3(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="player4">
					<ControlLabel>Player 4</ControlLabel>
					<FormControl value={player4} type="text" onChange={(e) => setPlayer4(e.target.value)} />
				</FormGroup>
				<FormGroup controlId="machine">
					<ControlLabel>machine</ControlLabel>
					<FormControl value={machine} componentClass="select" onChange={(e) => setMachine(e.target.value)}>
						{sortedMachinesArray.map((machine, index) => {
							return (
								<option key={index} value={machine}>
									{machine}
								</option>
							);
						})}
					</FormControl>
				</FormGroup>
				<LoaderButton
					block
					type="submit"
					bsSize="large"
					bsStyle="primary"
					isLoading={isLoading}
					disabled={!validateForm()}
				>
					Create
				</LoaderButton>
			</form>
		</div>
	);
}
