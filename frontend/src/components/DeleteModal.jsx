import React, { useState } from 'react';
import { FormattedMessage } from "react-intl";
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { IconButton, Box, Button, Divider, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import '../css/modal.css'


const DeleteModal = ({ message, selectedSerialNo, onDelete, onCancel, onClose }) => {

    const [openModal, setOpenModal] = useState(true);

    const handleCloseModal = () => {
        setOpenModal(false);
        onClose();
    };

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal} // Always set open to true in the ConfirmationModal component
                onClose={handleCloseModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openModal}>
                    <Box className="delete-confirmation">
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Box flexGrow={1} textAlign="center" paddingLeft="40px" paddingTop="15px">
                                <Typography>{selectedSerialNo}</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Box flexGrow={1} textAlign="center" paddingLeft="40px" paddingBottom="15px" paddingTop="15px">
                                <FormattedMessage id={message} />
                            </Box>
                            <IconButton>
                                <CloseIcon onClick={onClose} />
                            </IconButton>
                        </Box>

                        <Divider />

                        <Box className="delete-action">
                            <Button onClick={onDelete} variant="contained" className="confirm-button">
                                <FormattedMessage id='delete.yes' />
                            </Button>
                            <Button onClick={onCancel} variant="contained" className="cancel-button">
                                <FormattedMessage id='delete.cancel' />
                            </Button>
                        </Box>

                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default DeleteModal