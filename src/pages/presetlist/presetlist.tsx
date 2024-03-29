import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useLoading } from '@pages/loading/loading';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import { getPresets } from '@services/preset-services';
import { PresetInfo } from '@src/types/preset';
import { Icons } from '@utils/icons';
import { routes } from '@src/router/routes';
import { Endpoints } from '@src/constants';

const PresetList: React.FC = () => {
    const token = window.sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const searchbarRef = useRef<any>(null);
    const [presets, setPresets] = React.useState<PresetInfo[]>([]);

    useEffect(() => {
        if (token != '') {
            fetchPresets();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchPresets(): Promise<void> {
        //Fetch all presets
        try {
            appendLoading();
            const presets = await getPresets();
            presets.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            setPresets(presets);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            removeLoading();
        }
    }

    function displayPresets(): JSX.Element {
        if (presets.length === 0) {
            return (
                <div className="section-no-content">
                    <p>You have no presets uploaded. Click below to add your first preset</p>
                    <button className="btn-create-album" onClick={(): void => navigate('/generator/preset/create/')}>
                        Create
                    </button>
                </div>
            );
        } else {
            return (
                <div className="section-album">
                    <h2 className="page-title">Presets</h2>
                    <div className="SearchBarDiv">
                        <SearchBar
                            type="preset"
                            pathToSearch="presets"
                            navigate="/generator/preset/view/"
                            ref={searchbarRef}
                        />
                    </div>
                    <Container>
                        <div className="section-album-content">
                            <div className="albums-table">
                                <PresetsTable presets={presets} />
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
            {displayPresets()}
        </div>
    );
};

type PresetTableProps = {
    presets: PresetInfo[];
};

const PresetsTable: React.FC<PresetTableProps> = (props: PresetTableProps) => {
    const navigate = useNavigate();

    function onAlbumClick(id: string): void {
        navigate(`/generator/preset/view/${id}`);
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
                {props.presets !== undefined &&
                    props.presets.map((row: PresetInfo, i: number) => {
                        return (
                            <tr key={`${i}`} id={`${i}`} onClick={(): void => onAlbumClick(row.id!)}>
                                <td>{i + 1}</td>
                                <td>
                                    <img
                                        src={`${Endpoints.API_PRESET_GET_ARTWORK}/${row.id}/artwork.jpg`}
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

export default PresetList;
