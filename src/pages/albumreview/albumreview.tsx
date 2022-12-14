import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewView from '@components/reviews/reviews';
import Sidebar from '@src/components/sidebar/sidebar';
import { routes } from '@src/router/routes';

const AlbumReviews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const token = window.sessionStorage.getItem('token');

    useEffect(() => {
        if (token != null) {
            //Continue in page
        } else {
            navigate(routes.LOGIN);
        }
    }, [token]);

    return (
        <div className="page" id="page-upload-edit">
            <Sidebar />
            <div className="album-review">
                <ReviewView id={id as string} />
            </div>
        </div>
    );
};

export default AlbumReviews;
