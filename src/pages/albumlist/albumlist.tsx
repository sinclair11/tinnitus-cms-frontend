import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CombinedStates } from '@store/reducers/custom';
import { useLoading } from '@pages/loading/loading';
import SearchBar from '@components/searchbar/searchbar';
import Sidebar from '@components/sidebar/sidebar';
import { AlbumInfo } from '@src/types/album';
import { getAlbums } from '@services/album-services';
import { Container } from 'react-bootstrap';
import { Icons } from '@src/utils/icons';
import { createObjectStoragePath } from '@src/utils/helpers';
import { routes } from '@src/router/routes';
import { Endpoints } from '@src/constants';

const AlbumList: React.FC = () => {
    const navigate = useNavigate();
    const { appendLoading, removeLoading } = useLoading();
    const searchbarRef = useRef<any>(null);
    const [albums, setAlbums] = React.useState<AlbumInfo[]>([]);
    const preauthreq = useSelector<CombinedStates>((state) => state.ociReducer.config.prereq) as string;
    const token = window.sessionStorage.getItem('token');

    useEffect(() => {
        if (token != '') {
            fetchAlbums();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchAlbums(): Promise<void> {
        //Fetch all albums
        try {
            appendLoading();
            const albums = await getAlbums();
            albums.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
            //Add cover art paths
            albums.forEach((album) => {
                album.artwork = createObjectStoragePath(preauthreq, ['albums', album.id, `artwork.jpeg`]);
            });
            setAlbums(albums);
            //Loading is done
            removeLoading();
        } catch (error: any) {
            removeLoading();
        }
    }

    function displayAlbums(): JSX.Element {
        if (albums.length === 0) {
            return (
                <div className="section-no-content">
                    <p>You have no albums uploaded. Click below to add your first album</p>
                    <button className="btn-create-album" onClick={(): void => navigate('/album/create')}>
                        Create
                    </button>
                </div>
            );
        } else {
            return (
                <div className="page-content">
                    <h2 className="page-title">Albums</h2>
                    <div className="SearchBarDiv">
                        <SearchBar type="album" pathToSearch="albums" navigate="/albums/view/" ref={searchbarRef} />
                    </div>
                    <Container>
                        <div className="section-album-content">
                            <div className="albums-table">
                                <AlbumsTable albums={albums} />
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
            {displayAlbums()}
        </div>
    );
};

type AlbumTableProps = {
    albums: AlbumInfo[];
};

const AlbumsTable: React.FC<AlbumTableProps> = (props: AlbumTableProps) => {
    const navigate = useNavigate();

    function onAlbumClick(id: string): void {
        navigate(`/albums/view/${id}`);
    }

    return (
        <table className="table" id="albums-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cover</th>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Songs</th>
                    <th>Duration</th>
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
                {props.albums !== undefined &&
                    props.albums.map((row: AlbumInfo, i: number) => {
                        return (
                            <tr key={`${i}`} id={`${i}`} onClick={(): void => onAlbumClick(row.id)}>
                                <td>{i + 1}</td>
                                <td>
                                    <img
                                        src={`${Endpoints.API_ALBUM_GET_ARTWORK}/${row.id}/artwork.jpg`}
                                        alt="albums-cover"
                                    />
                                </td>
                                <td>
                                    <p>{row.name}</p>
                                </td>
                                <td>
                                    <p>{new Date(Date.parse(row.uploadDate)).toLocaleString()}</p>
                                </td>
                                <td>
                                    <p>{row.songs.length}</p>
                                </td>
                                <td>
                                    <p>{row.length}</p>
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

export default AlbumList;
