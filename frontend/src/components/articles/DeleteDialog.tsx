import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                記事を削除しますか？
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    「{title}」を削除します。この操作は元に戻せません。
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    キャンセル
                </Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    削除する
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
