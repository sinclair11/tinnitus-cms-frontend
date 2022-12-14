import React, { useEffect } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logoIcon from '@src/icons/logo.png';
import { routes } from '@src/router/routes';
import { Icons } from '@utils/icons';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const token = window.sessionStorage.getItem('token');

    useEffect(() => {
        if (token != null) {
            //Continue in page
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    function goToRoute(route: string): void {
        navigate(route);
    }

    return (
        <div className="Stack">
            <div className="header-div">
                <img src={logoIcon} alt="logo" />
                <h2>Content Management System</h2>
            </div>
            <div className={'GridActions GridMove'}>
                <ButtonGroup vertical className="ButtonGroup">
                    <Button className="GridButton GridButtonText" onClick={(): void => goToRoute(routes.DASHBOARD)}>
                        <img src={Icons['Dashboard']} className="ButtonIcon" />
                        Dashboard
                    </Button>
                    <Button className="GridButton GridButtonText" onClick={(): void => goToRoute(routes.ALBUM_LIST)}>
                        <img src={Icons['AudioIcon']} className="ButtonIcon" />
                        Albums
                    </Button>
                    <Button
                        // eslint-disable-next-line max-len
                        className="GridButton GridButtonText"
                        onClick={(): void => goToRoute(routes.SAMPLE_LIST)}
                    >
                        <img src={Icons['GeneratorIcon']} className="ButtonIcon" />
                        Generator
                    </Button>
                    <Button className="GridButton GridButtonText">
                        <img src={Icons['StatisticsIcon']} className="ButtonIcon" />
                        Statistics and reports
                    </Button>
                    <Button
                        className="GridButton GridButtonText"
                        onClick={(): Window => window.open('https://www.youtube.com/c/TinnitusSounds')!}
                    >
                        <img src={Icons['ChannelIcon']} className="ButtonIcon" />
                        YouTube channel
                    </Button>
                    <Button
                        className="GridButton GridButtonText"
                        onClick={(): Window => window.open('https://earsbuzzing.com/')!}
                    >
                        <img src={Icons['EarsbuzzingSite']} className="ButtonIcon" />
                        Ears Buzzing site
                    </Button>
                </ButtonGroup>
            </div>

            <p className="Copyright">Copyright © 2022 Tinnitus Sounds</p>
        </div>
    );
};

export default Home;
