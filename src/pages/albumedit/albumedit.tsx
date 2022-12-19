import AlbumForm from '@components/albumform/albumform';
import Artwork from '@components/artwork/artwork';
import Sidebar from '@components/sidebar/sidebar';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { Table } from '@components/table/table';
import { useNavigate, useParams } from 'react-router-dom';
import { editAlbumData, getAlbum } from '@src/services/album-services';
import { useLoading } from '@pages/loading/loading';
import { routes } from '@src/router/routes';
import { Endpoints } from '@src/constants';
import { AlbumEditInfo } from '@src/types/album';

const AlbumEdit: React.FC = () => {
    const { appendLoading, removeLoading } = useLoading();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const tableRef = createRef<any>();
    const formRef = createRef<any>();
    const artworkRef = createRef<any>();
    const content = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const albumData = useRef<any>(null);
    const formData = useRef<any>(null);
    const token = window.sessionStorage.getItem('token');

    useEffect(() => {
        if (token) {
            //Fetch data
            fetchAlbumData();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchAlbumData(): Promise<void> {
        try {
            appendLoading();
            albumData.current = await getAlbum(id!);
            albumData.current.artwork = `${Endpoints.API_ALBUM_GET_ARTWORK}/${id}/artwork.jpg`;
            formData.current = {
                name: albumData.current.name,
                description: albumData.current.description,
                tags: albumData.current.tags,
                length: albumData.current.length,
                category: albumData.current.category,
            };
            //Done fetching data
            setLoaded(true);
            removeLoading();
        } catch (error: any) {}
    }

    function calculateDuration(songs: Array<string>): void {
        formRef.current.setTotalDuration(songs);
    }

    async function onSave(): Promise<void> {
        try {
            const validation = await formRef.current.getInputValidation();
            if (validation) {
                const albumForm = formRef.current.getData();
                const newAlbumData: AlbumEditInfo = {
                    id: albumData.current.id,
                    description: albumForm.description,
                    tags: albumForm.tags,
                    category: albumForm.category,
                };
                const response = await editAlbumData(newAlbumData);

                alert(response);
            }
        } catch (error: any) {}
    }

    function displayPage(): JSX.Element {
        if (loaded) {
            return (
                <div className="page" id="page-upload-edit">
                    <Sidebar />
                    <div className="page-content" ref={content}>
                        <h2 className="page-title">Album edit view</h2>
                        {/* Album details */}
                        <div className="upload-album">
                            {/* Artwork */}
                            <Artwork ref={artworkRef} type="edit" img={albumData.current.artwork} />
                            {/* General info */}
                            <AlbumForm type={'edit'} ref={formRef} data={formData.current} />
                        </div>
                        {/* Table with songs */}
                        <Table
                            type="edit"
                            headers={['Position', 'Name', 'Duration', 'Category']}
                            ref={tableRef}
                            calculateDuration={calculateDuration}
                            data={albumData.current.songs}
                        />
                        <button className="upload-btn-album" onClick={onSave}>
                            Save
                        </button>
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default AlbumEdit;
