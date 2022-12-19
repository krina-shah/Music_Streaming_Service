import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Account from "../pages/Account";
import AlbumDetails from "../pages/AlbumDetails";
import Categories from "../pages/Categories";
import Category from "../pages/Category";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import IndPlayList from "../pages/IndPlayList";
import Library from "../pages/Library";
import NewReleases from "../pages/NewReleases";

import Playlist from "../pages/Playlist";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Error from "./Error";
import Lyrics from "./Lyrics";
import PrivateRoute from "./PrivateRoute";
import TrackDetails from "../pages/TrackDetails";
import Search from "./Search";
import Sidebar from "./Sidebar";
import SpotifyCallback from "./SpotifyCallback";
import SpotifyPrivateRoute from "./SpotifyPrivateRoute";

// import Lyrics from "./Lyrics";
// import IndPlayList from "../pages/IndPlayList";
import Recommendations from "./Recommendations";
// import Lyrics from "./Lyrics"


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <Router>
        <Sidebar />
        <main className={classes.content}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/spotifycallback" element={<SpotifyCallback />} />
              <Route element={<SpotifyPrivateRoute />}>
                <Route path="/search" element={<Search />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/album/:id" element={<AlbumDetails />} />
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/lyrics/:artist/:trackName" element={<Lyrics />} />
                <Route path="/Recommendations" element={<Recommendations />} />
                <Route path="/track/:id" element={<TrackDetails />} />


              </Route>
              <Route
                path="/IndPlayList/:PlaylistName"
                element={<IndPlayList />}
              />
            </Route>
            <Route
              path="*"
              element={<Error message="Error 404: That page does not exist!" />}
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
