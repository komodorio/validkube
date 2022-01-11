import React from "react";
import styled from "styled-components";
import GitHubButton from "react-github-btn";
import { ReactComponent as PoweredByKomodor } from "./assets/PoweredByKomodor.svg";
import { ReactComponent as LogoValidkube } from "./assets/Logo_validkube.svg";
import { ReactComponent as GitIcon } from "./assets/GitIcon.svg";
import { ReactComponent as LogoModblieValidkube } from "./assets/Logo_Modblie_validkube.svg";

export const KOMODOR_COM = "https://komodor.com/";

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
  > svg {
    vertical-align: center;
    width: 33px;
    padding-right: 0.3rem;
    padding-left: 1.5rem;
    margin-bottom: 0.45rem;
  }
`;

const RightHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.3rem;
`;

const StyledHr = styled.hr`
  border-top: 0.2px solid #9195a1;
  border-bottom: none;
  margin: 0;
`;

const TopContainer = styled.div`
  width: 100%;
`;

const PoweredByKomodorContainer = styled.div`
  align-self: center;
  cursor: pointer;
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

const MainViewHeader: React.FC = () => (
  <TopContainer>
    <Container>
      <LogoValidkubeContainer />
      <LogoValidkubeMobileContainer />
      <RightHeaderContainer>
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
        <PoweredByKomodorContainer>
          <PoweredByKomodor onClick={() => window.open(KOMODOR_COM)} />
        </PoweredByKomodorContainer>
      </RightHeaderContainer>
    </Container>
    <StyledHr />
  </TopContainer>
);

export default MainViewHeader;
