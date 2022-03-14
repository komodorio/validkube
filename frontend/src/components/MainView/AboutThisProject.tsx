import React, { Fragment } from "react";
import styled from "styled-components";
import { ReactComponent as CheckIcon } from "./assets/Check.svg";
import { ReactComponent as FireflyLogo } from "./assets/FireflyLogo.svg";
import { ReactComponent as DotIcon } from "./assets/DotIcon.svg";
import { ReactComponent as LinkedinIcon } from "./assets/LinkedinIcon.svg";
import { ReactComponent as TwitterIcon } from "./assets/TwitterIcon.svg";
import { ReactComponent as GreyDotIcon } from "./assets/GreyDotIcon.svg";
import Ukraine from "./assets/ukraine.svg";
import { FIREFLY_IO, LINKEDIN_URL, TWITTER_URL } from "./MainViewHeader";
import GitHubButton from "react-github-btn";
import { BrOnlyOnPc } from "./index";

const GITHUB_REPO_VALIDIAC = "https://github.com/gofireflyio/validiac";

const Container = styled.div`
  color: #0D0534;
  text-align: center;
  word-break: break-word;
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 1% 8%;
`;

const HeaderContainer = styled(Container)`
background: url(${Ukraine});
background-position: center center;
background-repeat: no-repeat;
background-size: cover;  @media (max-width: 74rem) {
    display: grid;
  }
`;

const BottomContainer = styled(Container)`
  color: #ffffff;
  @media (max-width: 74rem) {
    justify-content: space-between;
  }
`;

const MainDiv = styled.div`
  @media (min-width: 74rem) {
    width: 70%;
  }
`;

const StyledH4 = styled.h4`
  margin-block-end: 0rem;
`;

const StyledHeadline = styled(StyledH4)`
  font-family: Poppins;
  font-weight: 500;
  font-size: 20px;
`;

const CheckIconWithTextContainer = styled.div`
  align-items: baseline;
  display: flex;
  line-height: 1.5;
`;

const CheckIconContainer = styled.div`
  > svg {
    vertical-align: center;
    width: 1rem;
    padding-right: 0.6rem;
  }
`;

const CustomLink = styled.a`
  color: #0D0534;
  font-family: Roboto;
  align-self: center;
`;

export const SmallBr = styled.span`
  display: block;
  margin: 10px 0;
`;

const PolicyContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-block-end: 0rem;
  align-items: center;
`;

const CursorPointerWrapper = styled.div`
  cursor: pointer;
`;

const MobileWrapper = styled(PolicyContainer)`
  display: flex-inline;
  @media (max-width: 37rem) {
    display: none;
  }
`;

const PcWrapper = styled(PolicyContainer)`
  display: flex-inline;
  @media (min-width: 37rem) {
    display: none;
  }
`;

const SocialMediaContainer = styled(PolicyContainer)`
  margin: 5px 0;
  cursor: pointer;
  > svg {
    width: 36px;
  }
`;

const GithubButtonContainer = styled.span`
  vertical-align: -webkit-baseline-middle;
  @media (min-width: 30rem) {
    margin-left: 20px;
    vertical-align: middle;
  }
`;

export const AboutThisProjectBottom: React.FC = () => (
  <BottomContainer>
    <PolicyContainer>
      <div className="bottom">© Firefly 2022</div>
      <MobileWrapper>
        <DotIcon />
        <CursorPointerWrapper
          onClick={() => window.open(GITHUB_REPO_VALIDIAC)}
        >
          <div className="bottom">ValidIaC on Github</div>
        </CursorPointerWrapper>
        <DotIcon />
      <div className="bottom">#StandWithUkrine</div>
      </MobileWrapper>
    </PolicyContainer>
    <SocialMediaContainer>
      <PcWrapper>
        <LinkedinIcon onClick={() => window.open(LINKEDIN_URL)} />
        <TwitterIcon onClick={() => window.open(TWITTER_URL)} />
        <GreyDotIcon />
      </PcWrapper>
      <FireflyLogo onClick={() => window.open(FIREFLY_IO)} />
    </SocialMediaContainer>
  </BottomContainer>
);

export const AboutThisProjectHeader: React.FC = () => {
  const checks: {
    action: string;
    description: string;
    shortName: string;
    url: string;
  }[] = [
    {
      action: "Validate",
      description: "- Verify your IaC configuration files @",
      shortName: "tflint",
      url: " https://github.com/terraform-linters/tflint",
    },
    {
      action: "Secure",
      description: "- Scan your IaC for security vulnerabilities @",
      shortName: "tfsec",
      url: " https://github.com/aquasecurity/tfsec",
    },
    {
      action: "Cost",
      description: "- Scan your IaC for cost optimization @",
      shortName: "infracost",
      url: " https://github.com/infracost/infracost",
    },
    {
      action: "Map",
      description: "- Chart a map of your cloud infrastructure @",
      shortName: "inframap",
      url: " https://github.com/cycloidio/inframap",
    }
  ];
  return (
    <HeaderContainer>
      <MainDiv>
        <StyledHeadline>About this project</StyledHeadline>
        <br />
        <div>
          ValidIaC combines the best open-source tools to help ensure
          Infrastructure-as-Code best practices, hygiene & security.
        </div>
        <br />
        <StyledH4>Capabilities:</StyledH4>
        <br />
        {checks.map((check, index) => (
          <Fragment key={index}>
            <CheckIconWithTextContainer>
              <CheckIconContainer>
                <CheckIcon />
              </CheckIconContainer>
              <span>
                <b>{check.action} </b>
                {check.description}{" "}
                <CustomLink href={check.url} target={check.url}>
                  {check.shortName}
                </CustomLink>
                <GithubButtonContainer>
                  <GitHubButton
                    href={check.url}
                    data-color-scheme="no-preference: light; light: light; dark: light;"
                    data-icon="octicon-star"
                    data-size="medium"
                    data-show-count="true"
                    align-self="center"
                  ></GitHubButton>
                </GithubButtonContainer>
              </span>
              <SmallBr />
            </CheckIconWithTextContainer>
            <br />
          </Fragment>
        ))}
        <br />
        <div style={{ wordBreak: "break-word" }}>
          ValidIaC is an{" "}
          <CustomLink
            href={GITHUB_REPO_VALIDIAC}
            target={GITHUB_REPO_VALIDIAC}
          >
            open-source
          </CustomLink>{" "}
          solution, so please feel free to add more capabilities or tools :)
        </div>
        <br />
        <BrOnlyOnPc />
      </MainDiv>
    </HeaderContainer>
  );
};
