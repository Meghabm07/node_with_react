import React, { Fragment, useState } from 'react';
import axios from 'axios';
import '../../css/login.css';

const Register = () => {
	const [ formData, setformData ] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	const { name, email, password, confirmPassword } = formData;

	const onChange = (e) => setformData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			console.log('Passwords do not match');
		} else {
			const newUser = {
				name,
				email,
				password
			};

			try {
				const config = {
					headers: {
						'Content-Type': 'Application/json'
					}
				};
				const body = JSON.stringify(newUser);

				await axios
					.post('/api/users', body, config)
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<Fragment>
			<div className="row mt__10">
				<div className="col-md-3" />
				<div className="col-md-6">
					<div className="offset__border">
						<h3>
							<i className="fa fa-user-plus" aria-hidden="true" /> Sign Up
						</h3>
						<p>Create New Account</p>
						<form onSubmit={(e) => onSubmit(e)}>
							<div className="form-group">
								<label>Name</label>
								<input
									type="name"
									name="name"
									className="form-control"
									value={name}
									onChange={(e) => onChange(e)}
									placeholder="Enter Name"
								/>
							</div>
							<div className="form-group">
								<label>Email address</label>
								<input
									type="email"
									name="email"
									className="form-control"
									value={email}
									onChange={(e) => onChange(e)}
									placeholder="Enter email"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="exampleInputPassword1">Password</label>
								<input
									type="password"
									name="password"
									className="form-control"
									value={password}
									onChange={(e) => onChange(e)}
									placeholder="Password"
								/>
							</div>
							<div className="form-group">
								<label htmlFor="exampleInputPassword1">Confirm Password</label>
								<input
									type="password"
									name="confirmPassword"
									className="form-control"
									value={confirmPassword}
									onChange={(e) => onChange(e)}
									placeholder="Password"
								/>
							</div>
							<div className="form-check">
								<input type="checkbox" className="form-check-input" />
								<label className="form-check-label" htmlFor="exampleCheck1">
									Remember Me
								</label>
							</div>
							<div className="form-group">
								<button type="submit" className="mt-3 btn text-white bg-purple">
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
				<div className="col-md-3" />
			</div>
		</Fragment>
	);
};

export default Register;
