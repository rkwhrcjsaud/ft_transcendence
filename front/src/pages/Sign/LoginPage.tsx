import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import InputFields from '../../components/common/InputFields.tsx';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FormTemplate from '../../components/layout/AuthFormLayout.tsx';
// import axios from 'axios';

interface UserProps {
  username: string;
  password: string;
  showPassword: boolean;
}

const LoginPage = () => {
  const [formData, setFormData] = useState<UserProps>({
    username: '',
    password: '',
    showPassword: false,
  });
  const navigate = useNavigate();
  const { username, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const submitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    navigate('/');
    // try {
    //   const response = axios.post('api주소', {
    //     username: username,
    //     password: password
    //   });
    //   console.log('Login Success:', response);
    // } catch (error) {
    //   console.error('Login Failed:', error);
    // }
  };

  return (
    <FormTemplate>
      {
      <Form onSubmit={submitHandler}>
        <h3 className="text-center text-muted mb-2 mb-0">Sign In</h3>
        <InputFields
            placeholder="Username"
            name="username"
            value={username}
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
