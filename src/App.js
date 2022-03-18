import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import bodyStyles from './body.styles';
import useSearch from './useSearch';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(0, 0, 0, 0.87)',
    },
  },
});
function App() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState(null);
  const [tempQuery, setTempQuery] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [showSuggestions, fetchSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    setPageNum(1);
  }, [query]);
  const { photos, isLoading, isLastPage } = useSearch({
    type: query === null || query === '' ? 'getRecent' : 'search',
    query: query,
    pageNumber: pageNum,
  });
  const observer = useRef();
  const lastPhotoElementRef = useCallback(
    (node) => {
      if (isLoading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLastPage) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, isLastPage]
  );

  useEffect(() => {
    const suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];

    setSuggestions(suggestions);
  }, [showSuggestions]);

  const styles = bodyStyles();

  const handleChange = (val) => {
    setTempQuery(val);

    // Using debounce to store the value in query and make api call
    const debounceFn = debounce(() => {
      setQuery(tempQuery);
    }, 1000);
    debounceFn();
  };
  const handleLocalStorage = () => {
    let suggestions = localStorage.getItem('suggestions');
    if (suggestions === null) {
      suggestions = [];
      if (tempQuery !== '') suggestions.push(tempQuery);
    } else {
      suggestions = JSON.parse(suggestions);
      if (
        suggestions.includes(tempQuery) ||
        tempQuery === '' ||
        tempQuery === null
      ) {
        return;
      }
      suggestions.push(tempQuery);
    }
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
  };
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <>
          {isOpen && (
            <Dialog open={isOpen}>
              <DialogContent>
                <img
                  className={styles.modalImage}
                  src={`https://live.staticflickr.com/${photos[activePhoto]?.server}/${photos[activePhoto]?.id}_${photos[activePhoto]?.secret}_w.jpg`}
                  alt="modal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
          <AppBar color="primary" className={styles.toolBar} variant="outlined">
            <Toolbar>
              <div className={styles.headingContainer}>
                <Typography variant="h1" className="heading">
                  Search Photos
                </Typography>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: '200px' } }}
                  freeSolo
                  value={tempQuery}
                  options={suggestions}
                  getOptionLabel={(option) => option || ' '}
                  onFocus={() => fetchSuggestion(true)}
                  onBlur={() => {
                    handleLocalStorage();
                    fetchSuggestion(false);
                  }}
                  onChange={(event, newValue) => {
                    handleChange(newValue);
                  }}
                  // onInputChange={(e) => handleChange(e)}
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      label="Search"
                      variant="filled"
                      inputProps={{
                        ...props.inputProps,
                        onChange: (e) => {
                          handleChange(e.target.value);
                          props.inputProps.onChange(e);
                        },
                      }}
                    />
                  )}
                />
              </div>
            </Toolbar>
          </AppBar>
          <Grid container className={styles.root}>
            {photos.map(({ id, server, secret }, ind) => {
              if (photos.length === ind + 1) {
                return (
                  <Grid
                    item
                    sm={6}
                    md={4}
                    key={ind}
                    className="image-container"
                    ref={lastPhotoElementRef}
                  >
                    <Paper
                      elevation={1}
                      className="image-paper"
                      style={{ width: 'fit-content' }}
                      onClick={() => {
                        setActivePhoto(ind);
                        setOpen(true);
                      }}
                    >
                      <img
                        src={`https://live.staticflickr.com/${server}/${id}_${secret}_w.jpg`}
                        alt={` ${ind}`}
                      />
                    </Paper>
                  </Grid>
                );
              } else {
                return (
                  <Grid
                    item
                    sm={6}
                    md={4}
                    key={ind}
                    className="image-container"
                  >
                    <Paper
                      elevation={1}
                      className="image-paper"
                      style={{ width: 'fit-content' }}
                      onClick={() => {
                        setActivePhoto(ind);
                        setOpen(true);
                      }}
                    >
                      <img
                        src={`https://live.staticflickr.com/${server}/${id}_${secret}_w.jpg`}
                        alt={` ${ind} image`}
                      />
                    </Paper>
                  </Grid>
                );
              }
            })}
          </Grid>
          {photos.length === 0 && !isLoading && (
            <div className={styles.loading}>No Photos found</div>
          )}
          {isLoading && (
            <div className={styles.loading}>
              <CircularProgress />
            </div>
          )}
        </>
      </div>
    </ThemeProvider>
  );
}

export default App;
