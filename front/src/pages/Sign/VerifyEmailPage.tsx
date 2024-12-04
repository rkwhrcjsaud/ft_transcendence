import { Form, Button, Alert, ModalHeader } from 'reactstrap';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputFields } from '../../components/common/InputFields';
import FormTemplate from '../../components/layout/AuthFormLayout';

export const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [alertmessage, setAlertMessage] = useState('');
    const [alertcolor, setAlertColor] = useState('primary');

    const submitHandler = async (e: React.SyntheticEvent<EventTarget>) => {
        e.preventDefault();

        try {
            const response = await axios.post("https://localhost:443/api/accounts/verify/",
                { email: email, code: code },
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status == 200) {
                navigate('/');
            } else if (response.status == 204) {
                setAlertColor('warning');
                setAlertMessage('you are already registered');
            } else if (response.status == 400) {
                setAlertColor('danger');
                setAlertMessage('invalid code');
            }
        } catch {
            setAlertColor('danger');
            setAlertMessage('an error occurred while verifying the email');
        }
    };

    return (
        <FormTemplate>
            {alertmessage && <Alert color={alertcolor} className="mt-4">{alertmessage}</Alert>}
            <Form onSubmit={submitHandler}>
                <ModalHeader>Verify Email</ModalHeader>
                <InputFields
                    placeholder="Enter your email"
                    name = "email"
                    value={email}
                    changeHandler={(e) => setEmail(e.target.value)}
                />
                <InputFields
                    placeholder="Enter your code"
                    name = "otp"
                    value={code}
                    changeHandler={(e) => setCode(e.target.value)}
                />
                <Button color="primary" type="submit" className="mt-4">Verify</Button>
            </Form>
        </FormTemplate>
    );
};