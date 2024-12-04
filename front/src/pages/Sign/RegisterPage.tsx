import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { InputFields } from '../../components/common/InputFields';
import FormTemplate from '../../components/layout/AuthFormLayout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserProps {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    password2: string;
    showPassword: boolean;
}

export const RegisterPage = () => {
    const [formData, setFormData] = useState<UserProps>({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        password2: '',
        showPassword: false,
    });
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { email, username, first_name, last_name, password, password2 } = formData;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const submitHandler = async (e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault();
        if (password !== password2) {
            setAlertMessage('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("https://localhost:443/api/accounts/register/", formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status == 201) {
                console.log('Register Success:', response);
                navigate('/verify');
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.data) {
                    if (error.response.data.email) {
                        setAlertMessage(error.response?.data.email);
                    }
                }
                console.error('Register Failed:', error.response);
            }
        }
        setIsLoading(false);
    };
    
    return (
        <FormTemplate>
        {alertMessage && <Alert color="danger">{alertMessage}</Alert>}
            <Form onSubmit={submitHandler}>
                <h3 className="text-center text-muted mb-2 mb-0">Register</h3>
                <InputFields
                placeholder="Email"
                name="email"
                value={email}
                changeHandler={handleChange}
                />
                <InputFields
                placeholder="Username"
                name="username"
                value={username}
                changeHandler={handleChange}
                />
                <InputFields
                placeholder="FirstName"
                name="first_name"
                value={first_name}
                changeHandler={handleChange}
                />
                <InputFields
                placeholder="LastName"
                name="last_name"
                value={last_name}
                changeHandler={handleChange}
                />
                <InputFields
                placeholder="Password"
                name="password"
                value={password}
                changeHandler={handleChange}
                type={formData.showPassword ? 'text' : 'password'}
                minLength={8}
                >
                <Button
                    color="secondary"
                    onClick={() =>
                    setFormData({ ...formData, showPassword: !formData.showPassword })
                    }
                >
                    {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                </InputFields>
                <InputFields
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                changeHandler={handleChange}
                type={formData.showPassword ? 'text' : 'password'}
                />
                <Button color="primary" block>
                {isLoading ? <Spinner size="sm" color="light" /> : 'Register'}
                </Button>
                <Link to="/login">
                <small>Already have an account?</small>
                </Link>
            </Form>
        </FormTemplate>
    );
}