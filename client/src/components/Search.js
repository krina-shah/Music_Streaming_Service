import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Box,
  makeStyles,
  Button,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SearchSongs from "./SearchSongs";
import Error from "./Error";
import Loading from "./Loading";
import logo from "../icons/incognitomode2.png";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "200px",
    width: "200px",
    maxHeight: "200px",
    maxWidth: "200px",
  },
  button: {
    // color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const Search = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);

  const handleFileUpload = async (e) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("mp3File", file);
      const userToken = await currentUser.getIdToken();
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3008/search/bymp3",
        formData,
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      console.log(data);
      setSearchData(data);
      setLoading(false);
      setError({
        exists: false,
        message: "",
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError({
        exists: true,
        message: e.message,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.post(
          `http://localhost:3008/search`,
          {
            searchTerm: searchTerm || "Christmas",
          },
          {
            headers: { FirebaseIdToken: userToken },
          },
        );
        if (!data) throw "Failed to fetch search data!";
        setSearchData(data);
        setLoading(false);
        setError({
          exists: false,
          message: "",
        });
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError({
          exists: true,
          message: e.message,
        });
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, searchTerm]);

  const searchValue = async (value) => {
    setLoading(true);
    setSelectedFile(null);
    setSearchTerm(value);
  };

  const buildAlbumCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/album/${album?.id}`}>
              <CardHeader className={classes.titleHead} title={album?.name} />
              <CardMedia
                className={classes.media}
                component="img"
                image={album?.images[0]?.url}
                title={album?.name}
              />
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const buildTrackCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/track/${track?.id}`}>
              <CardHeader className={classes.titleHead} title={track?.name} />
              <CardMedia
                className={classes.media}
                component="img"
                image={track?.album.images[0].url}
                title={track?.name}
              />
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const buildArtistCard = (artist) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={artist?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/artist/${artist?.id}`}>
              <CardHeader className={classes.titleHead} title={artist?.name} />
              <CardMedia
                className={classes.media}
                component="img"
                image={artist?.images[0]?.url}
                title={artist?.name}
              />
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (error.exists) return <Error message={error.message} />;
  else {
    return (
      <div className="fancy-border">
        <img className="logo" src={logo} alt="logo" width={100} height={100} />
        <h1>{"Search"}</h1>
        <SearchSongs searchValue={searchValue} />
        <Box>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ marginRight: "1rem" }}
          >
            Search by MP3
            <input
              type="file"
              accept=".mp3"
              hidden
              onChange={(e) => handleFileUpload(e)}
            />
          </Button>
          {selectedFile && `Selected: ${selectedFile.name}`}
        </Box>
        {loading ? (
          <Loading />
        ) : (
          <Grid container className={classes.grid} spacing={5}>
            {searchData.tracks && searchData.tracks.items && (
              <Grid item className={classes.grid}>
                <h2>Tracks</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.tracks.items.map((track) =>
                    buildTrackCard(track),
                  )}
                </Grid>
              </Grid>
            )}
            {searchData.albums && searchData.albums.items && (
              <Grid item className={classes.grid}>
                <h2>Albums</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.albums.items.map((album) =>
                    buildAlbumCard(album),
                  )}
                </Grid>
              </Grid>
            )}
            {searchData.artists && searchData.artists.items && (
              <Grid item className={classes.grid}>
                <h2>Artists</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.artists.items.map((artist) =>
                    buildArtistCard(artist),
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    );
  }
};
export default Search;
