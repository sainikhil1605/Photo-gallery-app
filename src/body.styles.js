import { makeStyles } from '@material-ui/core/styles';

const bodyStyles = makeStyles({
  root: {
    marginTop: '130px',
    justifyContent: 'center',
    '& .image-container': {
      marginTop: '20px',
      marginBottom: '20px',
    },
    '& .image-paper': {
      '& .MuiPaper-root': {
        width: 'fit-content !important',
      },
      '& img': {
        '@media(max-width:450px)': {
          maxWidth: '250px',
        },
        '@media(min-width:450px)': {
          maxWidth: '400px',
        },
        margin: '5px',
        cursor: 'pointer',
      },
    },
  },
  modalImage: {
    '@media(max-width:450px)': {
      maxWidth: '250px',
    },
    '@media(min-width:450px)': {
      maxWidth: '400px',
    },
  },
  loader: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toolBar: {
    '& .MuiToolbar-regular': {
      minHeight: '130px !important',
    },
  },
  headingContainer: {
    minWidth: '500px',
    display: 'flex',
    '& .heading': {
      fontSize: '20px',
      paddingBottom: '10px',
    },
    '& .MuiFormControl-root': {
      backgroundColor: '#ffff !important',
    },
    '& legend': {
      color: '#fff',
    },
    '@media(max-width:780px)': {
      minWidth: '350px',
    },
    '@media(max-width:450px)': {
      minWidth: '250px',
    },
    margin: '0 auto',
    flexDirection: 'column',
  },
});
export default bodyStyles;
