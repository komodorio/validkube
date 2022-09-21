import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import './App.css';

import PrivateRoutes from './components/Routes/PrivateRoutes';
import { mainBackgrund } from './utils/Colors';
import { ScrollToTop } from './utils/scroll';
import { light, dark } from './utils/Themes';
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${mainBackgrund};
  }
`;
const GlobalStyleLight = createGlobalStyle`
 body {
    background-color:'white';
  }
`;

const themesMap: any = { light, dark };
const Container = styled.div`
  font-family: 'Roboto', sans-serif;
  color: ${(props) => props.theme.body};
  line-height: initial;
`;

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const theme = themesMap[currentTheme];

  useEffect(() => {
    const themeQuery = window.matchMedia('(prefers-color-scheme: light)');
    setCurrentTheme(themeQuery.matches ? 'light' : 'dark');
    themeQuery.addEventListener('change', ({ matches }) => {
      setCurrentTheme(matches ? 'light' : 'dark');
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ThemePreference.Provider value={{ currentTheme, setCurrentTheme }}>
        <ThemeProvider theme={theme}>
          <Container>
            {currentTheme === 'dark' ? <GlobalStyle /> : <GlobalStyleLight />}
            <PrivateRoutes />
          </Container>
        </ThemeProvider>
      </ThemePreference.Provider>
    </Router>
  );
};

export const ThemePreference = createContext<ThemeContextInterface | null>(
  null
);

interface ThemeContextInterface {
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
}
export default App;
