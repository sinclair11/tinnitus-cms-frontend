import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import logo from '@src/icons/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { refreshToken } from '@services/general-services';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [admin, setAdmin] = useState('');
    const [passw, setPassw] = useState('');
    const [adminInvalid, setAdminInvalid] = useState('');
    const [passwInvalid, setPasswInvalid] = useState('');
    const navigate = useNavigate();

    async function authAdmin(): Promise<void> {
        let isValid = 0;

        if (admin === '') {
            setAdminInvalid('Field must not be empty');
            isValid++;
        } else {
            setAdminInvalid('');
        }

        if (passw === '') {
            setPasswInvalid('Field must not be empty');
            isValid++;
        } else {
            setPasswInvalid('');
        }

        if (isValid === 0) {
            //Send authentication request
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8080/login',
                    {},
                    {
                        auth: {
                            username: admin,
                            password: passw,
                        },
                    },
                );
                const token = response.data.token;
                //Store JWT
                window.sessionStorage.setItem('token', JSON.stringify(token));
                //Store pre-authenticated request for object storage
                dispatch({
                    type: 'oci/config',
                    payload: {
                        prereq: response.data.preauthreq,
                    },
                });
                //Set timer to refresh token
                refreshToken(token.value, token.expiration);
                //Clear and go to home
                setAdmin('');
                setPassw('');
                navigate('/');
            } catch {
                setAdmin('');
                setPassw('');
                alert('Unauthorized access');
            }
        } else {
            /*Do nothing*/
        }
    }

    return (
        <div className="PageLogin">
            <img src={logo} className="LogoLogin" />
            <h2>Login Tinnitus CMS</h2>
            <Form noValidate className="LoginForm">
                <div className="InputSection" style={{ height: '55px' }}>
                    <InputGroup className="InputGroupPath" hasValidation>
                        <FormControl
                            required
                            placeholder="user"
                            className="LoginInput"
                            value={admin}
                            onChange={(e: any): void => {
                                setAdmin(e.target.value);
                                setAdminInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="InvalidRed" style={{ marginTop: '2px' }}>
                        {adminInvalid}
                    </p>
                </div>
                <div className="InputSection" style={{ height: '55px' }}>
                    <InputGroup className="InputGroupPath" hasValidation>
                        <FormControl
                            required
                            type="password"
                            placeholder="password"
                            className="LoginInput"
                            value={passw}
                            onChange={(e: any): void => {
                                setPassw(e.target.value);
                                setPasswInvalid('');
                            }}
                        />
                    </InputGroup>
                    <p className="InvalidRed" style={{ marginTop: '2px' }}>
                        {passwInvalid}
                    </p>
                </div>
                <Button onClick={authAdmin} className="LoginBtn">
                    Login
                </Button>
            </Form>
            <p className="Copyright">© 2022 Tinnitus Sounds</p>
        </div>
    );
};

export default Login;
