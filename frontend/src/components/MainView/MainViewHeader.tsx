import React from "react";
import styled from "styled-components";
import GitHubButton from "react-github-btn";
import { ReactComponent as PoweredByFirefly } from "./assets/PoweredByFirefly.svg";
import { ReactComponent as LogoValidiac } from "./assets/Logo_validiac.svg";
import { ReactComponent as GitIcon } from "./assets/GitIcon.svg";
import { ReactComponent as LinkedinIcon } from "./assets/LinkedinIcon.svg";
import { ReactComponent as DotIcon } from "./assets/DotIcon.svg";
import { ReactComponent as TwitterIcon } from "./assets/TwitterIcon.svg";
import { ReactComponent as LogoModblieValidiac } from "./assets/Logo_Modblie_validiac.svg";

export const FIREFLY_IO = "https://gofirefly.io/";
export const TWITTER_URL = "https://twitter.com/goFireflyio";
export const LINKEDIN_URL = "https://www.linkedin.com/company/gofireflyio/";

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
  @media (max-width: 45rem) {
    display: none;
  }
  > svg {
    vertical-align: center;
    width: 10px;
    margin-bottom: 0.45rem;
  }
`;

const StyledHr = styled.hr`
  border-top: 0.2px solid #9195a1;
  border-bottom: none;
  margin: 0;
`;

const TopContainer = styled.div`
  width: 100%;
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

const LogoValidiacContainer = styled(LogoValidiac)`
  @media (max-width: 35rem) {
    display: none;
  }
`;

const LogoValidiacMobileContainer = styled(LogoModblieValidiac)`
  @media (min-width: 35rem) {
    display: none;
  }
`;

const MainViewHeader: React.FC = () => (
  <TopContainer>
    <Container>
      <LogoValidiacContainer />
      <LogoValidiacMobileContainer />
      <RightHeaderContainer>
        <SocialButtonContainer>
          <LinkedinIcon onClick={() => window.open(LINKEDIN_URL)} />
        </SocialButtonContainer>
        <SocialButtonContainer>
          <TwitterIcon onClick={() => window.open(TWITTER_URL)} />
        </SocialButtonContainer>
        <DotIconContainer>
          <DotIcon />
        </DotIconContainer>
        <GitContainer>
          <GitIcon />
          <GitHubButton
            href="https://github.com/gofireflyio/validiac"
            data-color-scheme="no-preference: light; light: light; dark: light;"
            data-icon="octicon-star"
            data-size="medium"
            data-show-count="true"
            aria-label="Star firefly/validiac on GitHub"
            align-self="center"
          ></GitHubButton>
        </GitContainer>
        <DotIconContainer>
          <DotIcon />
        </DotIconContainer>
        <ClickButtonContainer>
          <PoweredByFirefly onClick={() => window.open(FIREFLY_IO)} />
        </ClickButtonContainer>
      </RightHeaderContainer>
    </Container>
    <StyledHr />
  </TopContainer>
);

export default MainViewHeader;
