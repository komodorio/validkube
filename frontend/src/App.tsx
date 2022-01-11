import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import "./App.css";
import PrivateRoutes from "./components/Routes/PrivateRoutes";
import { mainBackgrund } from "./utils/Colors";
import { ScrollToTop } from "./utils/scroll";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${mainBackgrund};
  }
`;

const Container = styled.div`
  font-family: "Roboto", sans-serif;
  color: black;
  line-height: initial;
`;

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Container>
        <GlobalStyle />
        <PrivateRoutes />
      </Container>
    </Router>
  );
};

export default App;
