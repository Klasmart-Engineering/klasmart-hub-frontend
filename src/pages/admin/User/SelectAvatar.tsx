import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DialogContent,
  DialogTitle,
  Dialog,
  Snackbar,
  IconButton,
  CircularProgress,
  Button,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {
  AccountCircle,
  AddPhotoAlternate,
  DeleteForever,
} from '@material-ui/icons';
import { Avatar } from '../../models/Avatar';

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  selectedValue: PropTypes.string,
  avatares: PropTypes.object,
};

const useStyles = makeStyles((theme) => ({
  fileInput: {
    display: 'none',
  },
  containerButtons: {
    display: 'flex',
    alignItems: 'center',
  },
  containerAvatars: {
    textAlign: 'center',
  },
}));

/**
 * Returns function to show a dialog for "Avatar" select
 */
function SimpleDialog(props: any) {
  const classes = useStyles();
  const { onClose, selectedValue, avatares, ...other } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const counter = useRef(0);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let object = { file: event.target.files[0], baseImage: '' };
      let reader = new FileReader();
      reader.onload = (e: any) => {
        object.baseImage = e.target.result;
        onClose(object);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= avatares.length) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose({});
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  const handleItemClick = (value: object) => {
    onClose(value);
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle>Select your avatar</DialogTitle>
        <DialogContent dividers>
          <div className={classes.containerAvatars}>
            <CircularProgress
              style={{ margin: 'auto', display: loading ? 'block' : 'none' }}
            />
            <div style={{ display: loading ? 'none' : 'block' }}>
              {avatares.map((itemAvatar: Avatar) => (
                <IconButton
                  key={itemAvatar.key}
                  onClick={() => handleItemClick(itemAvatar)}
                >
                  <img
                    src={itemAvatar.url}
                    height="50"
                    width="50"
                    alt="Avatar"
                    onLoad={imageLoaded}
                  />
                </IconButton>
              ))}
              <div
                style={{
                  display: 'inline',
                }}
              >
                <input
                  accept="image/gif, image/jpg, image/jpeg, image/png"
                  className={classes.fileInput}
                  id="btnFileAvatar"
                  onChange={onImageChange}
                  type="file"
                />
                <label htmlFor="btnFileAvatar">
                  <Tooltip title="Add avatar" placement="top-start">
                    <Button variant="contained" component="span">
                      <AddPhotoAlternate />
                    </Button>
                  </Tooltip>
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="warning">
          Invalid age range
        </Alert>
      </Snackbar>
    </>
  );
}

SimpleDialog.propTypes = {
  onChange: PropTypes.func,
};

/**
 * Returns function to show a dialog for "Avatar" field
 */
export default function SelectAvatar(props: any) {
  const classes = useStyles();
  const { value, onChange, avatarList } = props;
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || { url: '', key: '', file: '', baseImage: '' }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
    setSelectedValue(value);
    onChange(value);
  };

  const resetAvatar = () => {
    setSelectedValue({ url: '', key: '', file: '', baseImage: '' });
  };

  return (
    <div>
      {selectedValue.url || selectedValue.baseImage ? (
        <div className={classes.containerButtons}>
          <Tooltip title="Select avatar" placement="bottom-start">
            <IconButton onClick={handleClickOpen}>
              <img
                src={selectedValue.url || selectedValue.baseImage}
                alt="Avatar"
                onChange={onChange}
                height="50"
                width="50"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove avatar" placement="bottom-start">
            <IconButton onClick={resetAvatar}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <IconButton onClick={handleClickOpen}>
          <AccountCircle />
        </IconButton>
      )}
      <SimpleDialog
        selectedValue={selectedValue}
        avatares={avatarList}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
