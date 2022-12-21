import React, { createRef, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoading } from '@pages/loading/loading';
import Artwork from '@components/artwork/artwork';
import Player from '@components/player/player';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import Toolbar from '@components/toolbar/toolbar';
import { Container } from 'react-bootstrap';
import PresetInfoView from '@components/presetinfo/presetinfo';
import { routes } from '@src/router/routes';
import { getPresetById } from '@services/preset-services';
import { Endpoints } from '@src/constants';

const PresetView: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [presetData, setPresetData] = useState<any>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const token = window.sessionStorage.getItem('token');
    const navigate = useNavigate();
    const searchbarRef = createRef<any>();
    const playerRef = useRef<any>(null);
    const container = useRef(null);

    useEffect(() => {
        if (token != '') {
            if (id !== '0') {
                //Load data for selected album
                fetchPresetData(id as string);
            }
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    useEffect(() => {
        if (playerRef.current && dataFetched) {
            getAudioFile(presetData.name);
        }
    });

    async function fetchPresetData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all preset data
            const preset = await getPresetById(id);
            preset.uploadDate = new Date(Date.parse(preset.uploadDate)).toLocaleString();
            setPresetData(preset);
            setDataFetched(true);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            alert(error.message);
            removeLoading();
        }
    }

    async function getAudioFile(name: string): Promise<void> {
        playerRef.current.setSong(`${Endpoints.API_PRESET_GET_AUDIO}/${id}/${name}.mp3`);
    }

    function displayPage(): JSX.Element {
        if (dataFetched && presetData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h2 className="page-title">Preset information</h2>
                        <div className="SearchBarDiv">
                            <SearchBar
                                type="preset"
                                pathToSearch="presets"
                                navigate="/generator/preset/view/"
                                ref={searchbarRef}
                            />
                        </div>
                        <Container>
                            <Toolbar
                                itemId={id as string}
                                upload={routes.PRESET_CREATE}
                                edit={`/generator/preset/edit/${id}`}
                                reviews={`/generator/preset/reviews/${id}`}
                                categories={routes.PRESET_CATEGORIES}
                                return={routes.PRESET_LIST}
                                delete="preset"
                            />
                            <div className="section-album-content">
                                <div>
                                    <Artwork
                                        type="view"
                                        className="preset-preview-image"
                                        img={`${Endpoints.API_PRESET_GET_ARTWORK}/${id}/artwork.jpg`}
                                    />
                                </div>
                                <div className="preset-info-player">
                                    <PresetInfoView data={presetData} />
                                    <div className="player">
                                        <Player ref={playerRef} />
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </div>
                </div>
            );
        } else {
            return <div className="page"></div>;
        }
    }

    return displayPage();
};

export default PresetView;
