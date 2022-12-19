import React from 'react';
import { Button } from 'react-bootstrap';
import { Icons } from '@src/utils/icons';
import ReactModal from 'react-modal';
import { dialogStyles } from '@src/styles/styles';

type DialogboxProps = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    message: string;
    execute: CallableFunction;
};

export const DialogBox: React.FC<DialogboxProps> = (props: DialogboxProps) => {
    return (
        <ReactModal isOpen={props.isOpen} style={dialogStyles}>
            <div className="DialHeader">
                <p style={{ margin: '4px' }}>Message</p>
            </div>
            <p style={{ marginLeft: '10px' }}>{props.message}</p>
            <Button
                className="BtnOkDialog"
                onClick={(): void => {
                    //Accept action
                    props.execute();
                    //Close dialog box
                    props.setIsOpen(false);
                }}
            >
                OK
            </Button>
            <Button
                className="BtnCancel"
                onClick={(): void => {
                    props.setIsOpen(false);
                }}
            >
                Cancel
            </Button>
            <img src={Icons['CancelIcon']} className="cancel-icon" onClick={(): void => props.setIsOpen(false)} />
        </ReactModal>
    );
};
