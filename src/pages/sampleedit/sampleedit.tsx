import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from '@src/router/routes';
import { useLoading } from '@pages/loading/loading';
import Sidebar from '@components/sidebar/sidebar';
import SampleForm from '@components/sampleform/sampleform';
import { getSampleById } from '@services/sample-services';

const SampleEdit: React.FC = () => {
    const token = window.sessionStorage.getItem('token');
    const { appendLoading, removeLoading } = useLoading();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const sampleData = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (token != '') {
            //Fetch data
            fetchSampleData();
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    async function fetchSampleData(): Promise<void> {
        try {
            appendLoading();
            sampleData.current = await getSampleById(id!);
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
                        <h2 className="page-title">Sample edit</h2>
                        <SampleForm type={'edit'} data={sampleData.current} id={id} />
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }

    return displayPage();
};

export default SampleEdit;
