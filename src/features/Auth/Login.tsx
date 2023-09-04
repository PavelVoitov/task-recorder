import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "features/Auth/selectors";
import {authActions} from "features/Auth/index";
import {AppDispatch, useActions, useAppSelector} from "utils/redux-utils";

type FormikErrorType = {
	email?: string
	password?: string
	rememberMe?: boolean
}
type FormValuesType = {
	email: string,
	password: string,
	rememberMe: boolean
}

export const Login = () => {
	const dispatch = AppDispatch()
	const {login} = useActions(authActions)
	const isLoggedIn = useAppSelector(selectIsLoggedIn)

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			rememberMe: false
		},
		validate: (values) => {
			const errors: FormikErrorType = {}
			if (!values.email) {
				errors.email = 'Email is required!'
			}
			if (!values.password) {
				errors.password = 'Password is required!'
			} else if (values.password.length < 3) {
				errors.password = 'Password need to be more than 3 symbols'
			}
			return errors
		},

		onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
			const action = await dispatch(login(values))
			if (login.rejected.match(action)) {
				if (action.payload?.fieldsErrors?.length) {
					const error = action.payload?.fieldsErrors[0];
					formikHelpers.setFieldError(error.field, error.error)
				}
			}
		},
	})

	if (isLoggedIn) {
		return <Navigate to={'/'}/>
	}

	return <Grid container justifyContent={'center'}>
		<Grid item justifyContent={'center'}>
			<form onSubmit={formik.handleSubmit}>
				<FormControl>
					<FormLabel>
						<p>To log in get registered
							<a href={'https://social-network.samuraijs.com/'}
								 target={'_blank'}> here
							</a>
						</p>
						<p>or use common test account credentials:</p>
						<p>Email: free@samuraijs.com</p>
						<p>Password: free</p>
					</FormLabel>
					<FormGroup>
						<TextField
							label="Email"
							margin="normal"
							{...formik.getFieldProps("email")}
						/>
						<div style={{height: 10, marginBottom: 5}}>
							{formik.errors.email ? <div style={{color: "red"}}>{formik.errors.email}</div> : ''}
						</div>
						<TextField
							type="password"
							label="Password"
							margin="normal"
							{...formik.getFieldProps("password")}
						/>
						<div style={{height: 10, marginBottom: 5}}>
							{formik.errors.password ? <div style={{color: "red"}}>{formik.errors.password}</div> : ''}
						</div>
						<FormControlLabel
							label={'Remember me'}
							control={<Checkbox
								{...formik.getFieldProps("rememberMe")}
								checked={formik.values.rememberMe}
							/>}/>
						<Button type={'submit'} variant={'contained'} color={'primary'}>
							Login
						</Button>
					</FormGroup>
				</FormControl>
			</form>
		</Grid>
	</Grid>
}