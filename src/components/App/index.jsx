import { useEffect, useMemo, useState } from "react";
import Reader from "../Reader";
import "./App.css";
import {
  Button,
  TextField,
  Container,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  buttons: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  logo: {
    height: "50vmin",
  },
}));
function App() {
  const [url, setURL] = useState();
  const [query, setQuery] = useState();
  const [links, setLinks] = useState();

  const [number, setNumber] = useState();
  // const [scanUrl, setScanURL] = useState();
  // const [scanNumber, setScanNumber] = useState();
  // const [scanPage, setScanPage] = useState();

  // const [page, setPage] = useState();
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [loading, setLoading] = useState();

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          secondary: {
            main: "#82969f",
          },
        },
      }),
    [prefersDarkMode]
  );

  const saveInLocalStorage = () => {
    localStorage.setItem(
      "save",
      JSON.stringify({
        url,
        query,
        number,
      })
    );
  };

  const loadURL = async () => {
    setLoading(true);
    // console.log(url);
    try {
      if (url && query && number) {
        const [base, extension] = url.split("{number}");
        const urlFormed = base + number + extension;
        // const res = /.+?\{(.+)\}.*/.exec(url);

        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/" + urlFormed //selectInput(number)
        );
        console.log(response);
        var doc = new DOMParser().parseFromString(
          await response.text(),
          "text/html"
        );
        const nodeList = doc.body.querySelectorAll(query);
        const links = Array.from(nodeList).map((selected) =>
          selected.getAttribute("src")
        );

        setLinks(links);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const scrollToPages = () => {
    const reader = document.getElementById("reader");
    console.log(reader);
    if (reader) reader.scrollIntoView();
  };

  useEffect(() => {
    try {
      const save = JSON.parse(localStorage.getItem("save"));
      if (save) {
        setURL(save.url);
        setQuery(save.query);
        setNumber(save.number);
      }
    } catch (error) {}
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" overflowY="hidden">
        <Container maxWidth="lg">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {/* <img src={logo} className={classes.logo} alt="logo" /> */}
            <div className="glitch-container">
              <div className="glitch">
                {Array.from({ length: 5 }, (i) => (
                  <div className="glitch__img" key={i}></div>
                ))}
              </div>
            </div>
            <Box mt={4} display="flex" flexDirection="column" width="100%">
              <form
                className={classes.root}
                onSubmit={(event) => {
                  event.preventDefault();
                  loadURL();
                }}
              >
                <Box mt={4}>
                  <Typography align="center">
                    Entrez le scan que vous désirez lire.
                  </Typography>
                </Box>
                <Box mt={2} textAlign="center">
                  <Box display="flex" justifyContent="center" flexWrap="wrap">
                    <Grid container spacing={2}>
                      <Grid item lg={6} md={12} xs={12}>
                        <Tooltip
                          title={`Saisissez "{number}" à l'emplacement du numéro de scan.`}
                        >
                          <TextField
                            style={{ width: "100%" }}
                            label="URL du site"
                            variant="filled"
                            value={url}
                            onChange={({ target: { value } }) => setURL(value)}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item lg={3} md={6} xs={12}>
                        <Tooltip
                          title={`Le sélecteur css déteminant les images à récupérer.`}
                        >
                          <TextField
                            label="Selecteur d'images"
                            style={{ width: "100%" }}
                            variant="filled"
                            value={query}
                            onChange={({ target: { value } }) =>
                              setQuery(value)
                            }
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item lg={3} md={6} xs={12}>
                        <TextField
                          style={{ width: "100%" }}
                          label="Numéro de scan"
                          type="number"
                          variant="filled"
                          value={number}
                          onChange={({ target: { value } }) => setNumber(value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box className={classes.buttons}>
                    <Tooltip title="Se souvenir des paramètre">
                      <Button
                        variant="contained"
                        size="large"
                        color="muted"
                        type="button"
                        onClick={saveInLocalStorage}
                      >
                        Sauvegarder
                      </Button>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      type="submit"
                    >
                      Charger
                    </Button>
                  </Box>
                </Box>
              </form>
              {/* <Divider
                orientation="vertical"
                flexItem
                style={{
                  marginLeft: theme.spacing(2),
                  marginRight: theme.spacing(2),
                }}
              />
              <form
                className={classes.root}
                onSubmit={(event) => {
                  event.preventDefault();
                  loadURL2();
                }}
              >
                <Box mt={4}>
                  <Typography align="center">
                    Entrez le scan que vous désirez lire.
                  </Typography>
                </Box>
                <Box mt={2} textAlign="center">
                  <Box display="flex" justifyContent="center" flexWrap="wrap">
                    <TextField
                      label="URL des scans"
                      variant="filled"
                      value={scanUrl}
                      onChange={({ target: { value } }) => setScanURL(value)}
                    />
                    <TextField
                      label="Numéro de scan"
                      type="number"
                      variant="filled"
                      value={scanNumber}
                      onChange={({ target: { value } }) => setScanNumber(value)}
                    />
                    <TextField
                      label="Page du scan"
                      type="number"
                      variant="filled"
                      value={scanPage}
                      onChange={({ target: { value } }) => setScanPage(value)}
                    />
                  </Box>
                  <Box className={classes.buttons}>
                    <Tooltip title="Se souvenir des paramètre">
                      <Button
                        variant="contained"
                        size="large"
                        color="muted"
                        type="button"
                        onClick={saveInLocalStorage}
                      >
                        Sauvegarder
                      </Button>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      type="submit"
                    >
                      Charger
                    </Button>
                  </Box>
                </Box>
              </form> */}
            </Box>

            <Box display="flex" justifyContent="center" py={4}>
              {loading ? (
                <CircularProgress color="secondary" />
              ) : (
                links && (
                  <IconButton
                    aria-label="delete"
                    className={classes.margin}
                    onClick={scrollToPages}
                  >
                    <ExpandMoreIcon fontSize="large" />
                  </IconButton>
                )
              )}
            </Box>
          </Box>
        </Container>
        <Container
          style={{
            maxWidth: "100vw",
          }}
        >
          {!loading && links && <Reader links={links} />}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default App;
