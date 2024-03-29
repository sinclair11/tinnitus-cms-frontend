import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '@src/router/routes';
import { useLoading } from '@pages/loading/loading';
import Sidebar from '@components/sidebar/sidebar';
import PresetForm from '@components/presetform/presetform';
import { getPresetById } from '@services/preset-services';

const PresetEdit: React.FC = () => {
    const token = window.sessionStorage.getItem('token');
    const { appendLoading, removeLoading } = useLoading();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const presetData = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (token != '') {
            //Fetch data
            fetchPresetData();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchPresetData(): Promise<void> {
        try {
            appendLoading();
            presetData.current = await getPresetById(id!);
            //Done fetching data
            setLoaded(true);
            removeLoading();
        } catch (error) {
            removeLoading();
        }
    }

    function displayPage(): JSX.Element {
        if (loaded) {
            return (
                <div className="page">
                    <Sidebar />
                    <div className="page-content">
                        <h2 className="page-title">Preset edit</h2>
                        <PresetForm type={'edit'} data={presetData.current} id={id} />
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default PresetEdit;
