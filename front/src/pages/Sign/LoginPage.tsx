import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import InputFields from '../../components/common/InputFields.tsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FormTemplate from '../../components/layout/AuthFormLayout.tsx';
import axios, { AxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth.tsx';
import SocialLoginButton from '../../components/common/SocialLoginButton.tsx';

interface Auser {
  id: number;
  username: string;
  full_name: string;
  email: string;
}

interface UserProps {
  email: string;
  password: string;
  showPassword: boolean;
}

const LoginPage = () => {
  const Auth = useAuth();
  const [formData, setFormData] = useState<UserProps>({
    email: '',
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const { email, password } = formData;
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:443/api/accounts/login/", formData,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const auser: Auser = {
          id: response.data.id,
          username: response.data.username,
          full_name: response.data.full_name,
          email: response.data.email,
        };
        if (await Auth?.login(auser, response.data.access_token, response.data.refresh_token))
          navigate('/');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          setAlertMessage('Please sign in with another account');
        } else if (error.response?.data?.error) {
          setAlertMessage(error.response.data.error);
        } else {
          setAlertMessage('An error occurred. Please try again');
        }
      } else if (error instanceof Error && error.message) {
        setAlertMessage("Credentials are incorrect");
      } else {
        setAlertMessage('Unknown error occurred. Please try again');
      }
    }
  };

  return (
    <FormTemplate>
      {alertMessage && <Alert color="danger">{alertMessage}</Alert>}
      <Form onSubmit={submitHandler}>
        <h3 className="text-center text-muted mb-2 mb-0">Sign In</h3>
        <InputFields
            placeholder="Email"
            name="email"
            value={email}
            changeHandler={handleChange} />
        <InputFields
            placeholder="Password"
            name="password"
            value={password}
            changeHandler={handleChange} type={formData.showPassword ? "text" : "password"} >
            <Button color="secondary"
                onClick={() => setFormData({ ...formData, showPassword: !formData.showPassword })}>
                {formData.showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
            </Button>
        </InputFields>
        <Button color="primary" block>Sign In</Button>
        <SocialLoginButton redirectUrl={`${import.meta.env.VITE_42_API_URL}`} icon='' message='Sign in with ' />
        <Col>
          <Row>
            <Link to="/register">
                <small>Create an Account</small>
            </Link>
          </Row>
        </Col>
      </Form>
    </FormTemplate>
  );
};

export default LoginPage;
