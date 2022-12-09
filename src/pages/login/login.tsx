import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import logo from '@src/icons/logo.png';
import { useNavigate } from 'react-router-dom';
import { db } from '@config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { useLoading } from '@pages/loading/loading';
import { getAlbums } from '@services/album-services';
import { getSamples } from '@services/sample-services';
import { getPresets } from '@services/preset-services';
import axios from 'axios';

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const [admin, setAdmin] = useState('');
    const [passw, setPassw] = useState('');
    const [adminInvalid, setAdminInvalid] = useState('');
    const [passwInvalid, setPasswInvalid] = useState('');
    const { appendLoading, removeLoading } = useLoading();
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
                    const result = await axios.post(
                        'http://127.0.0.1:8080/api/login',
                        {},
                        {
                            auth: {
                                username: admin,
                                password: passw,
                            },
                        },
                    );
                    dispatch({
                        type: 'general/auth',
                        payload: result.data,
                    });
                    appendLoading();
                    // await fetchCategories();
                    // await fetchAlbums();
                    // await fetchSamples();
                    // await fetchPresets();
                    removeLoading();
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
                removeLoading();
            }
        } else {
            /*Do nothing*/
        }
    }

    async function fetchCategories(): Promise<void> {
        try {
            let docSnap = await getDoc(doc(db, 'misc', 'albums'));
            let data = docSnap.data()!;
            dispatch({
                type: 'album/categories',
                payload: data.categories,
            });
            docSnap = await getDoc(doc(db, 'misc', 'samples'));
            data = docSnap.data()!;
            dispatch({
                type: 'sample/categories',
                payload: data.categories,
            });
            docSnap = await getDoc(doc(db, 'misc', 'presets'));
            data = docSnap.data()!;
            dispatch({
                type: 'preset/categories',
                payload: data.categories,
            });
        } catch (error) {
            throw error;
        }
    }

    async function fetchAlbums(): Promise<void> {
        dispatch({
            type: 'album/setAlbums',
            payload: await getAlbums(),
        });
    }

    async function fetchSamples(): Promise<void> {
        dispatch({
            type: 'sample/setSamples',
            payload: await getSamples(),
        });
    }

    async function fetchPresets(): Promise<void> {
        dispatch({
            type: 'preset/setPresets',
            payload: await getPresets(),
        });
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
