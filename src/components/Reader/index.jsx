import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
const useStyles = makeStyles((theme) => ({
  imgBox: {
    "&::after": {
      content: "Voyez cette boîte orange.",
      backgroundColor: "#FFBA10",
      borderColor: "black",
      borderStyle: "dotted",
      height: "100px",
      width: "100px",
      display: "block",
      position: "relative",
    },
  },
}));

const scrollToPage = (inverse) => {
  const next = Array.from(document.querySelectorAll(".Reader-page")).reduce(
    (acc, cur) => {
      if (acc) {
        if (inverse) {
          const { bottom: curTop } = cur.getBoundingClientRect();
          const { bottom: accTop } = acc.getBoundingClientRect();
          if (accTop < curTop && accTop >= 0) return acc;
        } else {
          const { top: curTop } = cur.getBoundingClientRect();
          const { top: accTop } = acc.getBoundingClientRect();
          if (accTop < curTop && accTop > 0) return acc;
        }
      }
      return cur;
    },
    undefined
  );

  if (next) next.scrollIntoView();
};

function Reader({ links }) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const classes = useStyles();
  console.log(links);
  const previousPage = () => index > 0 && setIndex(index - 2);
  const nextPage = () => index < links.length - 1 && setIndex(index + 2);

  const handleUserKeyPress = useCallback(
    (event) => {
      console.log(event.key, index);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousPage();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        nextPage();
      }
    },
    [index]
  );

  const goTop = () => window.scroll(0, 0);

  useEffect(() => {
    document.addEventListener("keydown", handleUserKeyPress);

    return () => {
      document.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(() => {
    setIndex(0);
  }, [links]);

  return (
    <Grid
      container
      spacing={0}
      id="reader"
      style={{
        position: "relative",
        justifyContent: "flex-end",
        // height: "100vh",
      }}
    >
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          top: 0,
          left: theme.spacing(2),
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <IconButton
          color="secondary"
          disabled={index <= 0}
          onClick={previousPage}
        >
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Box>
      <Box
        style={{
          position: "absolute",
          bottom: 0,
          top: 0,
          right: theme.spacing(2),
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <IconButton
          color="secondary"
          disabled={index >= links.length + 1}
          onClick={nextPage}
        >
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box>
      <Box
        style={{
          position: "absolute",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <IconButton color="default" onClick={goTop}>
          <KeyboardArrowUpIcon fontSize="large" />
        </IconButton>
      </Box>

      {links &&
        links.map((link, i) => (
          <Grid
            style={{
              display: index === i || index === i + 1 ? "flex" : "none",
              height: "100vmin",
            }}
            container
            item
            xs={6}
            justify={i % 2 && "flex-end"}
            display="flex"
          >
            <Box
              className={classes.imgBox}
              style={{
                background: `url(${link}) no-repeat center`,
                backgroundSize: "contain",
                width: "100%",
                backgroundPositionX: i % 2 ? "right" : "left",
              }}
            >
              {/* <img
                src={link}
                alt="page 1"
                key={i}
                style={{ maxHeight: "100vh", maxWidth: "49vw" }}
              /> */}
            </Box>
          </Grid>
        ))}
    </Grid>
  );
}

export default Reader;
