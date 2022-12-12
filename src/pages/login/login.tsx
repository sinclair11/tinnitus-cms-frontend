import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import logo from '@src/icons/logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

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
                    console.log(response.data);
                    //Store JWT
                    dispatch({
                        type: 'general/auth',
                        payload: response.data.token,
                    });
                    //Store pre-authenticated request for object storage
                    dispatch({
                        type: 'oci/config',
                        payload: {
                            prereq: response.data.preauthreq,
                        },
                    });
                    setAdmin('');
                    setPassw('');
                    navigate('/');
                } catch {
                    setAdmin('');
                    setPassw('');
                    alert('Unauthorized Access');
                }
            } catch (error: any) {
                setAdmin('');
                setPassw('');
                alert(error.message);
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
