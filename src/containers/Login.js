import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { Button, FormGroup, FormControl, Form } from 'react-bootstrap';

// import LoaderButton from '../components/LoaderButton';
import { useAppContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Login.css';

export default function Login() {
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);
	const [fields, handleFieldChange] = useFormFields({
		email: '',
		password: '',
	});

	function validateForm() {
		return fields.email.length > 0 && fields.password.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.signIn(fields.email, fields.password);
			userHasAuthenticated(true);
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	return (
		<div className="Login">
			<Form onSubmit={handleSubmit}>
				<FormGroup controlId="email">
					<Form.Label>Email</Form.Label>
					<FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
				</FormGroup>
				<FormGroup controlId="password">
					<Form.Label>Password</Form.Label>
					<FormControl type="password" value={fields.password} onChange={handleFieldChange} />
				</FormGroup>
				<Button
					variant="primary"
					block
					type="submit"
					onClick={isLoading ? handleSubmit : null}
					disabled={!validateForm()}
				>
					{isLoading ? 'Loading…' : 'Login'}
				</Button>
			</Form>
		</div>
	);
}
