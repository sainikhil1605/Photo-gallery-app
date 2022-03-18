import axios from 'axios';
import { useEffect, useState } from 'react';

const useSearch = ({ type, query, pageNumber }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  useEffect(() => {
    setPhotos([]);
  }, [query]);
  useEffect(() => {
    let cancel;
    const getData = async () => {
      let params;
      setLoading(true);
      if (type === 'search') {
        params = {
          api_key: `${process.env.REACT_APP_API_KEY}`,
          page: pageNumber,
          per_page: 9,
          format: 'json',
          nojsoncallback: 1,
          text: query,
        };
      } else {
        params = {
          api_key: `${process.env.REACT_APP_API_KEY}`,
          page: pageNumber,
          per_page: 9,
          format: 'json',
          nojsoncallback: 1,
        };
      }
      try {
        const res = await axios({
          method: 'GET',
          url: `https://www.flickr.com/services/rest/?method=flickr.photos.${type}`,
          params: {
            ...params,
          },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        if (res?.status === 200) {
          setLoading(false);
          if (res.data.photos.photo) {
            setPhotos((prevPhotos) => [
              ...prevPhotos,
              ...res.data.photos.photo,
            ]);
            setIsLastPage(res.data.photos.photo > 0);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
      }
    };
    getData();
    return () => cancel();
  }, [type, query, pageNumber]);
  return { photos, isLoading, isLastPage };
};
export default useSearch;
