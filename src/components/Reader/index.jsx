import { useCallback, useEffect } from "react";
import "./index.css";

const Page = ({ link }) => (
  <img
    className="Reader-page"
    //     style="    margin: 0 auto;
    // max-width: 50%;
    // /* width: 44vw; */
    // /* width: calc(50vw); */
    // height: 100vh;"
    src={link}
  />
);

const Couple = ({ children }) => (
  <div className="Reader-couple">{children}</div>
);

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
  console.log(links);
  const handleUserKeyPress = useCallback((event) => {
    console.log(event.key);
    if (event.key === "PageDown") {
      event.preventDefault();
      scrollToPage();
    }
    if (event.key === "PageUp") {
      event.preventDefault();
      scrollToPage(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleUserKeyPress);

    return () => {
      document.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <div className="Reader-content">
      <div className="Reader-wrapper">
        {links && links.map((page, i) => <Page link={page} key={i} />)}
      </div>
    </div>
  );
}

export default Reader;
