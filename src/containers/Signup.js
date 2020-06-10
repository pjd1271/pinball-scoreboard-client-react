import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, Form, Button } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { useAppContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Signup.css';

export default function Signup() {
	const [fields, handleFieldChange] = useFormFields({
		email: '',
		password: '',
		confirmPassword: '',
		confirmationCode: '',
	});
	const history = useHistory();
	const [newUser, setNewUser] = useState(null);
	const { userHasAuthenticated } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);

	function validateForm() {
		return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword;
	}

	function validateConfirmationForm() {
		return fields.confirmationCode.length > 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			const newUser = await Auth.signUp({
				username: fields.email,
				password: fields.password,
			});
			setIsLoading(false);
			setNewUser(newUser);
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	async function handleConfirmationSubmit(event) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await Auth.confirmSignUp(fields.email, fields.confirmationCode);
			await Auth.signIn(fields.email, fields.password);

			userHasAuthenticated(true);
			history.push('/');
		} catch (e) {
			onError(e);
			setIsLoading(false);
		}
	}

	function renderConfirmationForm() {
		return (
			<Form onSubmit={handleConfirmationSubmit}>
				<FormGroup controlId="confirmationCode">
					<Form.Label>Confirmation Code</Form.Label>
					<FormControl autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
					<Form.Text>Please check your email for the code.</Form.Text>
				</FormGroup>
				<Button
					variant="primary"
					block
					type="submit"
					onClick={isLoading ? handleConfirmationSubmit : null}
					disabled={!validateConfirmationForm()}
				>
					{isLoading ? 'Loading…' : 'Verify'}
				</Button>
			</Form>
		);
	}

	function renderForm() {
		return (
			<Form onSubmit={handleSubmit}>
				<FormGroup controlId="email">
					<Form.Label>Email</Form.Label>
					<FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
				</FormGroup>
				<FormGroup controlId="password">
					<Form.Label>Password</Form.Label>
					<FormControl type="password" value={fields.password} onChange={handleFieldChange} />
				</FormGroup>
				<FormGroup controlId="confirmPassword">
					<Form.Label>Confirm Password</Form.Label>
					<FormControl type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
				</FormGroup>
				<Button
					variant="primary"
					block
					type="submit"
					onClick={isLoading ? handleSubmit : null}
					disabled={!validateForm()}
				>
					{isLoading ? 'Loading…' : 'Signup'}
				</Button>
			</Form>
		);
	}

	return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>;
}
