import React, { Fragment, useState } from 'react';
import '../../css/login.css';

const Login = () => {
	const [ formData, setformData ] = useState({
		email: '',
		password: ''
	});

	const { email, password } = formData;

	const onChange = (e) => setformData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = (e) => {
		e.preventDefault();

		let user = {
			email,
			password
		};

		console.log(user);
	};

	return (
		<Fragment>
			<div className="row mt__10">
				<div className="col-md-3" />
				<div className="col-md-6">
					<div className="offset__border ">
						<h3>
							<i className="fa fa-sign-in" aria-hidden="true" /> Sign In
						</h3>
						<p>Sign in to user account</p>
						<form onSubmit={(e) => onSubmit(e)}>
							<div className="form-group">
								<label htmlFor="exampleInputEmail1">Email address</label>
								<input
									type="email"
									className="form-control"
									value={email}
									name="email"
									onChange={(e) => onChange(e)}
									placeholder="Enter email"
								/>
								<small id="emailHelp" className="form-text text-muted">
									We'll never share your email with anyone else.
								</small>
							</div>
							<div className="form-group">
								<label htmlFor="exampleInputPassword1">Password</label>
								<input
									type="password"
									className="form-control"
									value={password}
									name="password"
									onChange={(e) => onChange(e)}
									placeholder="Password"
								/>
							</div>
							<div className="form-check">
								<input type="checkbox" className="form-check-input" />
								<label className="form-check-label" htmlFor="exampleCheck1">
									Check me out
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

export default Login;
