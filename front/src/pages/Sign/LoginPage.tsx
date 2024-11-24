import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import InputFields from '../../components/common/InputFields.tsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FormTemplate from '../../components/layout/AuthFormLayout.tsx';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth.tsx';

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
        console.log('Login Success:', response);
      }
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  return (
    <FormTemplate>
      {
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
        <Col>
          <Row>
            <Link to="/register">
                <small>Create an Account</small>
            </Link>
          </Row>
        </Col>
      </Form>
    }
    </FormTemplate>
  );
};

export default LoginPage;
