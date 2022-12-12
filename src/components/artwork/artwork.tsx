import { Icons } from '@src/utils/icons';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

type ArtworkProps = {
    type: string;
    img?: any;
    className?: string;
    message?: string;
};

const Artwork = forwardRef((props: ArtworkProps, ref: any) => {
    const [thumbnail, setThumbnail] = useState<any>(null);
    const [thumbnailInvalid, setThumbnailInvalid] = useState<any>('');
    const thumbnailFile = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        getInputValidation: (): boolean => {
            if (thumbnail === null) {
                setThumbnailInvalid('Image not selected');
                return false;
            } else {
                setThumbnailInvalid('');
                return true;
            }
        },

        getData: (): File => {
            return thumbnail;
        },

        clearInternalStates: (): void => {
            thumbnailFile.current = null;
            setThumbnail(null);
        },
    }));

    function onPlusClick(): void {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg, .jpeg';
        input.onchange = (): void => {
            setThumbnail(input.files![0]);
            setThumbnailInvalid('');
        };
        input.click();
    }

    function displayThumbnail(): JSX.Element {
        if (thumbnail) {
            return <img src={URL.createObjectURL(thumbnail)} />;
        } else {
            return (
                <p className="no-img-txt">
                    {props.message !== undefined ? props.message : 'Please select a cover art for album'}
                </p>
            );
        }
    }

    function display(): JSX.Element {
        if (props.type === 'view' || props.type === 'edit') {
            return (
                <div className="upload-album-artwork-div">
                    <div className={'upload-album-artwork' + ' ' + props.className}>
                        <img src={props.img} />
                    </div>
                </div>
            );
        } else if (props.type === 'edit' || props.type === 'create') {
            return (
                <div className="upload-album-artwork-div">
                    <div className={'upload-album-artwork' + ' ' + props.className}>
                        <div className="plus-body" onClick={onPlusClick}>
                            <img src={Icons.Plus} className="plus" />
                        </div>
                        {displayThumbnail()}
                    </div>
                    <p className="invalid-input invalid-thumbnail">{thumbnailInvalid}</p>
                </div>
            );
        } else {
            return <></>;
        }
    }

    return display();
});

export default Artwork;
