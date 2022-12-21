import React, { createRef, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLoading } from '@pages/loading/loading';
import { CombinedStates } from '@store/reducers/custom';
import { createObjectStoragePath } from '@utils/helpers';
import Artwork from '@components/artwork/artwork';
import Player from '@components/player/player';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import Toolbar from '@components/toolbar/toolbar';
import { Container } from 'react-bootstrap';
import SampleInfoView from '@components/sampleinfo/sampleinfo';
import { routes } from '@src/router/routes';
import { getSampleById } from '@services/sample-services';
import { Endpoints } from '@src/constants';

const SampleView: React.FC = () => {
    const token = window.sessionStorage.getItem('token');
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [sampleData, setSampleData] = useState<any>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const navigate = useNavigate();
    const searchbarRef = createRef<any>();
    const playerRef = useRef<any>(null);
    const container = useRef(null);
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;

    useEffect(() => {
        if (token != '') {
            if (id !== '0') {
                //Load data for selected album
                fetchSampleData(id as string);
            }
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    useEffect(() => {
        if (playerRef.current && dataFetched) {
            getAudioFile(sampleData.name);
        }
    });

    async function fetchSampleData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all sample data
            const sample = await getSampleById(id);
            sample.uploadDate = new Date(Date.parse(sample.uploadDate)).toLocaleString();
            setSampleData(sample);
            setDataFetched(true);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            alert(error.message);
        }
    }

    async function getAudioFile(name: string): Promise<void> {
        playerRef.current.setSong(`${Endpoints.API_SAMPLE_GET_AUDIO}/${id}/${name}.mp3`);
    }

    function displayPage(): JSX.Element {
        if (dataFetched && sampleData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h2 className="page-title">Sample information</h2>
                        <div className="SearchBarDiv">
                            <SearchBar
                                type="sample"
                                pathToSearch="samples"
                                navigate="/generator/sample/view/"
                                ref={searchbarRef}
                            />
                        </div>
                        <Container>
                            <Toolbar
                                itemId={id as string}
                                upload={routes.SAMPLE_CREATE}
                                edit={`/generator/sample/edit/${id}`}
                                reviews={`/generator/sample/reviews/${id}`}
                                categories={routes.SAMPLE_CATEGORIES}
                                return={routes.SAMPLE_LIST}
                                delete="sample"
                            />
                            <div className="section-album-content">
                                <div>
                                    <Artwork
                                        type="view"
                                        img={`${Endpoints.API_SAMPLE_GET_ARTWORK}/${id}/artwork.jpg`}
                                    />
                                </div>
                                <div className="sample-info-player">
                                    <SampleInfoView data={sampleData} />
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

export default SampleView;
