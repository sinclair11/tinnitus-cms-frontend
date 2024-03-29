import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useLoading } from '@pages/loading/loading';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import { getSamples } from '@services/sample-services';
import { SampleInfo } from '@src/types/sample';
import { Icons } from '@utils/icons';
import { routes } from '@src/router/routes';
import { Endpoints } from '@src/constants';

const SampleList: React.FC = () => {
    const token = window.sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const searchbarRef = useRef<any>(null);
    const [samples, setSamples] = React.useState<SampleInfo[]>([]);

    useEffect(() => {
        if (token != '') {
            fetchSamples();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchSamples(): Promise<void> {
        //Fetch all samples
        try {
            appendLoading();
            const samples = await getSamples();
            samples.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            setSamples(samples);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            removeLoading();
        }
    }

    function displaySamples(): JSX.Element {
        if (samples.length === 0) {
            return (
                <div className="section-no-content">
                    <p>You have no samples uploaded. Click below to add your first sample</p>
                    <button className="btn-create-album" onClick={(): void => navigate('/generator/sample/create/')}>
                        Create
                    </button>
                </div>
            );
        } else {
            return (
                <div className="section-album">
                    <h2 className="page-title">Samples</h2>
                    <div className="SearchBarDiv">
                        <SearchBar
                            type="sample"
                            pathToSearch="samples"
                            navigate="/generator/sample/view/"
                            ref={searchbarRef}
                        />
                    </div>
                    <Container>
                        <div className="section-album-content">
                            <div className="albums-table">
                                <SamplesTable samples={samples} />
                            </div>
                        </div>
                    </Container>
                </div>
            );
        }
    }

    return (
        <div className="page">
            <Sidebar />
            {displaySamples()}
        </div>
    );
};

type SampleTableProps = {
    samples: SampleInfo[];
};

const SamplesTable: React.FC<SampleTableProps> = (props: SampleTableProps) => {
    const navigate = useNavigate();

    function onAlbumClick(id: string): void {
        navigate(`/generator/sample/view/${id}`);
    }

    return (
        <table className="table" id="albums-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cover</th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Duration</th>
                    <th>
                        <img src={Icons.Views} />
                    </th>
                    <th>
                        <img src={Icons.Likes} />
                    </th>
                    <th>
                        <img src={Icons.Favorites} />
                    </th>
                    <th>
                        <img src={Icons.Reviews} />
                    </th>
                </tr>
            </thead>
            <tbody>
                {props.samples !== undefined &&
                    props.samples.map((row: SampleInfo, i: number) => {
                        return (
                            <tr key={`${i}`} id={`${i}`} onClick={(): void => onAlbumClick(row.id!)}>
                                <td>{i + 1}</td>
                                <td>
                                    <img
                                        src={`${Endpoints.API_SAMPLE_GET_ARTWORK}/${row.id}/artwork.jpg`}
                                        alt="Preset Cover"
                                    />
                                </td>
                                <td>
                                    <p>{row.name}</p>
                                </td>
                                <td>
                                    <p>{new Date(Date.parse(row.uploadDate)).toLocaleString()}</p>
                                </td>
                                <td>
                                    <p>{row.length}</p>
                                </td>
                                <td>
                                    <p>{row.views}</p>
                                </td>
                                <td>
                                    <p>{row.likes}</p>
                                </td>
                                <td>
                                    <p>{row.favorites}</p>
                                </td>
                                <td>
                                    <p>{row.reviews}</p>
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
};

export default SampleList;
