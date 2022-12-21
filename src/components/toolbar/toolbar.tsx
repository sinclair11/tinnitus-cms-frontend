import React, { forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolbarIcons } from '@utils/icons';
import ReactTooltip from 'react-tooltip';
import { deleteAlbum } from '@src/services/album-services';
import { useLoading } from '@pages/loading/loading';
import { deletePreset } from '@services/preset-services';

type ToolbarProps = {
    container?: string;
    itemId: string;
    upload: string;
    edit: string;
    delete: string;
    reviews: string;
    categories: string;
    return: string;
};

const Toolbar = forwardRef((props: ToolbarProps, ref?: any) => {
    const { appendLoading, removeLoading } = useLoading();
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        //
    }));

    function onReviewClick(): void {
        navigate(props.reviews);
    }

    function onEditClick(): void {
        navigate(props.edit);
    }

    function onCategoriesClick(): void {
        navigate(props.categories);
    }

    function onUploadClick(): void {
        navigate(props.upload);
    }

    async function deleteItem(): Promise<void> {
        if (props.itemId) {
            try {
                //Activate loading screen
                if (props.itemId !== undefined) {
                    appendLoading();
                    let response = '';
                    //Delete resource from storage and database
                    switch (props.delete) {
                        case 'album': {
                            response = await deleteAlbum(props.itemId);
                            break;
                        }
                        case 'sample': {
                            // await deleteSample(props.itemId);
                            break;
                        }
                        case 'preset': {
                            response = await deletePreset(props.itemId);
                            break;
                        }
                    }
                    removeLoading();
                    alert(response);
                    navigate(props.return);
                }
            } catch (error: any) {
                //Set message and notify user about occured error
                removeLoading();
            }
        }
    }

    function onDeleteClick(): void {
        if (confirm('Are you sure you want to delete this resource ?')) {
            deleteItem();
        }
    }

    return (
        <div className={props.container + ' ToolbarContainer '}>
            <ReactTooltip place="top" type="dark" effect="float" delayShow={500} />
            <div className="toolbar-action" onClick={onUploadClick}>
                <img src={ToolbarIcons.UploadIcon} className="ActionIcon" />
                <p>Upload</p>
            </div>
            <div className="toolbar-action" onClick={onEditClick}>
                <img src={ToolbarIcons.EditIcon} className="ActionIcon" />
                <p>Edit</p>
            </div>
            <div className="toolbar-action" onClick={onDeleteClick}>
                <img src={ToolbarIcons.DeleteIcon} className="ActionIcon" />
                <p>Delete</p>
            </div>
            <div className="toolbar-action" onClick={onReviewClick}>
                <img src={ToolbarIcons.Reviews} className="ActionIcon" />
                <p>Reviews</p>
            </div>
            <div className="toolbar-action" onClick={onCategoriesClick}>
                <img src={ToolbarIcons.Categories} className="ActionIcon" />
                <p>Categories</p>
            </div>
        </div>
    );
});

export default Toolbar;
