import React, { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import "./App.css";
import { ThemePreference } from "./components/Context/ThemeContext";
import PrivateRoutes from "./components/Routes/PrivateRoutes";
import { mainBackground } from "./utils/Colors";
import { ScrollToTop } from "./utils/scroll";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${mainBackground};
  }
`;
const GlobalStyleLight = createGlobalStyle`
 body {
    background-color:'white';
  }
`;

const Container = styled.div`
  font-family: "Roboto", sans-serif;
  color: ${(props) => props.theme.body};
  line-height: initial;
`;

const App: React.FC = () => {
  const themes = useContext(ThemePreference);
  return (
    <Router>
      <ScrollToTop />
      <ThemeProvider theme={themes?.theme}>
        <Container>
          {themes?.currentTheme === "dark" ? (
            <GlobalStyle />
          ) : (
            <GlobalStyleLight />
          )}
          <PrivateRoutes />
        </Container>
      </ThemeProvider>
    </Router>
  );
};

export default App;
