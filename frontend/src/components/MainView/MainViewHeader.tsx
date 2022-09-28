import React, { useContext } from "react";
import styled from "styled-components";
import GitHubButton from "react-github-btn";
import { ReactComponent as PoweredByKomodor } from "./assets/PoweredByKomodor.svg";
import { ReactComponent as LogoValidkube } from "./assets/Logo_validkube.svg";
import { ReactComponent as GitIcon } from "./assets/GitIcon.svg";
import { ReactComponent as LinkedinIcon } from "./assets/LinkedinIcon.svg";
import { ReactComponent as TwitterIcon } from "./assets/TwitterIcon.svg";
import { ReactComponent as LogoModblieValidkube } from "./assets/Logo_Modblie_validkube.svg";
import { ReactComponent as MoonIcon } from "./assets/MoonIcon.svg";
import { ReactComponent as SunIcon } from "./assets/SunIcon.svg";

import { ThemePreference } from "../Context/ThemeContext";

export const KOMODOR_COM = "https://komodor.com/";
export const TWITTER_URL = "https://twitter.com/Komodor_com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/komodor-ltd/";

const Container = styled.div`
  padding: 1% 1.5%;

  @media (max-width: 35rem) {
    padding: 1% 6%;
  }
  display: flex;
  justify-content: space-between;
`;

const GitContainer = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 30rem) {
    padding-left: 1.5rem;
  }
  > svg {
    vertical-align: center;
    width: 33px;
    margin-right: 0.3rem;
    margin-bottom: 0.4rem;
  }
`;

const RightHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  > svg {
    vertical-align: center;
    width: 33px;
    margin-bottom: 0.45rem;
  }
`;

const DotIconContainer = styled.div`
  cursor: pointer;
  > svg {
    vertical-align: center;
  }
`;

const StyledHr = styled.hr`
  border-top: 0.2px solid #9195a1;
  border-bottom: none;
  margin: 0;
`;

const TopContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
`;

const ClickButtonContainer = styled.span`
  align-self: center;
  cursor: pointer;
`;

const SocialButtonContainer = styled(ClickButtonContainer)`
  @media (max-width: 45rem) {
    display: none;
  }
`;

const LogoValidkubeContainer = styled(LogoValidkube)`
  @media (max-width: 35rem) {
    display: none;
  }
`;

const LogoValidkubeMobileContainer = styled(LogoModblieValidkube)`
  @media (min-width: 35rem) {
    display: none;
  }
`;

const MainViewHeader: React.FC = () => {
  const theme = useContext(ThemePreference);
  const togglerTheme = theme?.currentTheme === "dark" ? "light" : "dark";

  return (
    <TopContainer>
      <Container>
        <LogoValidkubeContainer />
        <LogoValidkubeMobileContainer />
        <RightHeaderContainer>
          <SocialButtonContainer>
            <LinkedinIcon onClick={() => window.open(LINKEDIN_URL)} />
          </SocialButtonContainer>
          <SocialButtonContainer>
            <TwitterIcon onClick={() => window.open(TWITTER_URL)} />
          </SocialButtonContainer>
          <GitContainer>
            <GitIcon />
            <GitHubButton
              href="https://github.com/komodorio/validkube"
              data-color-scheme="no-preference: light; light: light; dark: light;"
              data-icon="octicon-star"
              data-size="medium"
              data-show-count="true"
              aria-label="Star komodorio/validkube on GitHub"
              align-self="center"
            ></GitHubButton>
          </GitContainer>
          <DotIconContainer>
            {theme?.currentTheme === "dark" ? (
              <SunIcon onClick={() => theme?.setCurrentTheme(togglerTheme)} />
            ) : (
              <MoonIcon onClick={() => theme?.setCurrentTheme(togglerTheme)} />
            )}
          </DotIconContainer>
          <ClickButtonContainer>
            <PoweredByKomodor onClick={() => window.open(KOMODOR_COM)} />
          </ClickButtonContainer>
        </RightHeaderContainer>
      </Container>
      <StyledHr />
    </TopContainer>
  );
};

export default MainViewHeader;
