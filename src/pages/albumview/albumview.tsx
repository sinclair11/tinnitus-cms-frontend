import React, { createRef, useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import SearchBar from '@src/components/searchbar/searchbar';
import Toolbar from '@src/components/toolbar/toolbar';
import Sidebar from '@components/sidebar/sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import Artwork from '@components/artwork/artwork';
import AlbumInfoView from '@components/albuminfo/albuminfo';
import '@components/modal-search/modal-search.css';
import { SongData } from '@src/types/album';
import { Table } from '@components/table/table';
import { Icons } from '@src/utils/icons';
import Player from '@components/player/player';
import { useLoading } from '@pages/loading/loading';
import { routes } from '@src/router/routes';
import { getAlbum } from '@services/album-services';
import { Endpoints } from '@src/constants';

const AlbumView: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const [albumData, setAlbumData] = useState<any>(null);
    const [dataFetched, setDataFetched] = useState(false);
    const token = window.sessionStorage.getItem('token');
    const navigate = useNavigate();
    const searchbarRef = createRef<any>();
    const playerRef = createRef<any>();
    const container = useRef(null);
    const artworkRef = useRef('');

    useEffect(() => {
        if (token != null) {
            if (id !== '0') {
                //Load data for selected album
                fetchAlbumData(id as string);
            }
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    useEffect(() => {
        if (dataFetched) {
            getSongUrl(albumData.songs[0]);
        }
    }, [dataFetched]);

    async function fetchAlbumData(id: string): Promise<void> {
        try {
            appendLoading();
            //Fetch all album data
            const album = await getAlbum(id);
            album.uploadDate = new Date(Date.parse(album.uploadDate)).toLocaleString();
            setAlbumData(album);
            setDataFetched(true);
            artworkRef.current = `${Endpoints.API_ALBUM_GET_ARTWORK}/${id}/artwork.jpg`;
            //Loading is done
            removeLoading();
        } catch (error: any) {
            alert(error.message);
            removeLoading();
        }
    }

    async function getSongUrl(song: SongData): Promise<void> {
        try {
            playerRef.current.setSong(`${Endpoints.API_ALBUM_GET_AUDIO}/${id}/${song.name}.mp3`);
        } catch (error) {
            throw error;
        }
    }

    function displayPage(): JSX.Element {
        if (dataFetched && albumData !== undefined) {
            return (
                <div className="page" id="page-album-view">
                    <Sidebar />
                    <div className="page-content" ref={container}>
                        <h2 className="page-title">Album information</h2>
                        <div className="SearchBarDiv">
                            <SearchBar type="album" pathToSearch="albums" navigate="/album/view/" ref={searchbarRef} />
                        </div>
                        <Container>
                            <Toolbar
                                itemId={id as string}
                                upload={routes.ALBUM_CREATE}
                                edit={`/album/edit/${id}`}
                                reviews={`/album/reviews/${id}`}
                                categories={routes.ALBUM_CATEGORIES}
                                return={routes.ALBUM_LIST}
                                delete="album"
                            />
                            <div className="section-album-content">
                                <div>
                                    <Artwork type="view" img={artworkRef.current} />
                                    <Player ref={playerRef} />
                                </div>
                                <AlbumInfoView data={albumData} />
                            </div>
                            <Table
                                type="view"
                                headers={[
                                    'Position',
                                    'Name',
                                    'Length',
                                    'Category',
                                    <img src={Icons.Views} />,
                                    <img src={Icons.Likes} />,
                                    <img src={Icons.Favorites} />,
                                ]}
                                data={albumData.songs}
                                onRowSelected={getSongUrl}
                            />
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

export default AlbumView;
