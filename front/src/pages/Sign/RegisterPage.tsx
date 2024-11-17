import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'reactstrap';
import { useNavigate, Link } from 'react-router-dom';
import { InputFields } from '../../components/common/InputFields';
import FormTemplate from '../../components/layout/AuthFormLayout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface UserProps {
  username: string;
  password: string;
  password2: string;
  showPassword: boolean;
}

export const RegisterPage = () => {
    const [formData, setFormData] = useState<UserProps>({
        username: '',
        password: '',
        password2: '',
        showPassword: false,
    });
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { username, password, password2 } = formData;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (password !== password2) {
        setAlertMessage('Passwords do not match');
        return;
        }
        setIsLoading(true);
        try {
        const response = await axios.post('api주소', {
            username: username,
            password: password,
        });
        console.log('Register Success:', response);
        navigate('/login');
        } catch (error) {
        console.error('Register Failed:', error);
        setAlertMessage('Register Failed');
        } finally {
        setIsLoading(false);
        }
    };
    
    return (
        <FormTemplate>
        {alertMessage && <Alert color="danger">{alertMessage}</Alert>}
            <Form onSubmit={submitHandler}>
                <h3 className="text-center text-muted mb-2 mb-0">Sign Up</h3>
                <InputFields
                placeholder="Username"
                name="username"
                value={username}
                changeHandler={handleChange}
                />
                <InputFields
                placeholder="Password"
                name="password"
                value={password}
                changeHandler={handleChange}
                type={formData.showPassword ? 'text' : 'password'}
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
                {isLoading ? <Spinner size="sm" color="light" /> : 'Sign Up'}
                </Button>
                <Link to="/login">
                <small>Already have an account?</small>
                </Link>
            </Form>
        </FormTemplate>
    );
}