import React, { useRef, useEffect, createRef } from 'react';
import Sidebar from '@components/sidebar/sidebar';
import { Table } from '@components/table/table';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CombinedStates } from '@src/store/reducers/custom';
import ProgressbarUpload from '@components/progressbar/progressbar-upload';
import AlbumForm from '@src/components/albumform/albumform';
import Artwork from '@components/artwork/artwork';
import { deleteAlbum, uploadAlbumArtowrk, uploadAlbumFile, uploadAlbumInfo } from '@src/services/album-services';
import { SongData } from '@src/types/album';
import { Category } from '@src/types/general';
import { routes } from '@src/router/routes';

const AlbumCreate: React.FC = () => {
    const navigate = useNavigate();
    const categories = useSelector<CombinedStates>((state) => state.albumReducer.categories) as Category[];
    const tableRef = createRef<any>();
    const formRef = createRef<any>();
    const artworkRef = createRef<any>();
    const progressbarRef = createRef<any>();
    const controller = useRef(new AbortController());
    const content = useRef(null);
    const token = window.sessionStorage.getItem('token');
    const cancelled = useRef(false);

    useEffect(() => {
        if (token != null) {
            //Done loading
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    function calculateDuration(songs: Array<string>): void {
        formRef.current.setTotalDuration(songs);
    }

    function onUploadCancelled(): void {
        controller.current.abort();
        cancelled.current = true;
    }

    function clearChildrenStates(): void {
        formRef.current.clearInternalStates();
        tableRef.current.clearInternalStates();
        artworkRef.current.clearInternalStates();
    }

    function updateProgress(progress: number, type: string, message: string): void {
        progressbarRef.current.setProgress(progress);
        progressbarRef.current.logMessage(type, message);
    }

    async function registerAlbumInDb(): Promise<string> {
        const albumDataCopy = formRef.current.getData();
        albumDataCopy.likes = 0;
        albumDataCopy.favorites = 0;
        albumDataCopy.reviews = 0;
        const tableData: SongData[] = tableRef.current.getData();
        const tableDataCopy: SongData[] = [];
        for (const entry of tableData) {
            const obj: SongData = {
                name: entry.name,
                position: entry.position,
                length: entry.length,
                category: entry.category,
                favorites: entry.favorites,
                likes: entry.likes,
                views: entry.views,
            };

            tableDataCopy.push(obj);
        }
        albumDataCopy.totalSongs = tableDataCopy.length;
        albumDataCopy.songs = tableDataCopy;
        const response = await uploadAlbumInfo(albumDataCopy);

        return response;
    }

    async function onUpload(): Promise<void> {
        let id = '';
        try {
            let progress = 10;
            //Verify if all inputs are valid
            const formValidation = await formRef.current.getInputValidation();
            const artworkValidation = await artworkRef.current.getInputValidation();
            const tableValidation = await tableRef.current.getInputValidation();
            if (formValidation && artworkValidation && tableValidation) {
                progressbarRef.current.enable(true);
                updateProgress(progress, 'info', 'Uploading album...');
                updateProgress(progress, 'success', 'Album registered in database');
                id = await registerAlbumInDb();
                const songsData: Array<SongData> = tableRef.current.getData();
                const step = Math.floor(80 / songsData.length);
                for (const song of songsData) {
                    if (cancelled.current) throw new Error('User cancelled upload');
                    const form = new FormData();
                    const extension = song.file?.name.split('.').pop();
                    form.append('id', id);
                    form.append('name', song.name + '.' + extension);
                    form.append('file', song.file!);
                    await uploadAlbumFile(form, controller.current);
                    updateProgress((progress += step), 'success', `Album song ${song.name} uploaded successfully`);
                }
                const form = new FormData();
                form.append('id', id);
                form.append('name', 'artwork.jpg');
                form.append('file', artworkRef.current.getData());
                const result = await uploadAlbumArtowrk(form, controller.current);
                if (cancelled.current) throw new Error('User cancelled upload');
                updateProgress(100, 'success', result);
                progressbarRef.current.logMessage('info', 'All album data uploaded successfully');
                clearChildrenStates();
            }
        } catch (error: any) {
            if (cancelled.current) {
                progressbarRef.current.operationFailed('User cancelled operation');
            } else {
                progressbarRef.current.operationFailed(error.message);
            }
            //Reset cancel state
            cancelled.current = false;
            controller.current = new AbortController();
            //Log operation status
            progressbarRef.current.logMessage('info', 'Preparing album for deletion...');
            try {
                await deleteAlbum(id);
                progressbarRef.current.setProgress(100);
                progressbarRef.current.logMessage('info', 'Album deleted successfully');
            } catch (error: any) {
                alert('Could not delete requested resource. Please contact development team !');
            }
        }
    }

    function displayContent(): JSX.Element {
        if (categories.length > 0) {
            return (
                <div className="page-content" ref={content}>
                    <h2 className="page-title">Album upload</h2>
                    {/* Album details */}
                    <div className="upload-album">
                        {/* Artwork */}
                        <Artwork ref={artworkRef} type="create" />
                        {/* General info */}
                        <AlbumForm type={'create'} ref={formRef} />
                    </div>
                    {/* Table with songs */}
                    <Table
                        type="create"
                        headers={['Position', 'Name', 'Duration', 'Category']}
                        ref={tableRef}
                        calculateDuration={calculateDuration}
                    />
                    <button className="upload-btn-album" onClick={onUpload}>
                        Upload
                    </button>
                </div>
            );
        } else {
            return (
                <div className="section-no-content">
                    <p>There are no categories available. Click below to add a category</p>
                    <button className="goto-categories-btn" onClick={(): void => navigate(routes.ALBUM_CATEGORIES)}>
                        Create
                    </button>
                </div>
            );
        }
    }

    return (
        <div className="page" id="page-upload-create">
            <Sidebar />
            {displayContent()}
            <ProgressbarUpload ref={progressbarRef} abort={onUploadCancelled} />
        </div>
    );
};

export default AlbumCreate;
