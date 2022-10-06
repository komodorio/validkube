import React, { Fragment } from "react";
import styled from "styled-components";
import { mainBackground, purpleBackground } from "../../utils/Colors";
import { ReactComponent as CheckIcon } from "./assets/Check.svg";
import { ReactComponent as KomodorLogo } from "./assets/KomodorLogo.svg";
import { ReactComponent as DotIcon } from "./assets/DotIcon.svg";
import { ReactComponent as LinkedinIcon } from "./assets/LinkedinIcon.svg";
import { ReactComponent as TwitterIcon } from "./assets/TwitterIcon.svg";
import { ReactComponent as GreyDotIcon } from "./assets/GreyDotIcon.svg";
import { KOMODOR_COM, LINKEDIN_URL, TWITTER_URL } from "./MainViewHeader";
import GitHubButton from "react-github-btn";
import { BrOnlyOnPc } from "./index";

const GITHUB_REPO_VALIDKUBE = "https://github.com/komodorio/validkube";

const Container = styled.div`
  color: white;
  text-align: center;
  word-break: break-word;
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 1% 8%;
`;

const HeaderContainer = styled(Container)`
  background-color: ${purpleBackground};
  @media (max-width: 74rem) {
    display: grid;
  }
`;

const BottomContainer = styled(Container)`
  @media (max-width: 74rem) {
    justify-content: space-between;
  }
  background-color: ${mainBackground};
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
  color: white;
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
      <div>© Komodor 2022</div>
      <MobileWrapper>
        <DotIcon />
        <CursorPointerWrapper
          onClick={() => window.open(GITHUB_REPO_VALIDKUBE)}
        >
          <div>Validkube on Github</div>
        </CursorPointerWrapper>
      </MobileWrapper>
    </PolicyContainer>
    <SocialMediaContainer>
      <PcWrapper>
        <LinkedinIcon onClick={() => window.open(LINKEDIN_URL)} />
        <TwitterIcon onClick={() => window.open(TWITTER_URL)} />
        <GreyDotIcon />
      </PcWrapper>
      <KomodorLogo onClick={() => window.open(KOMODOR_COM)} />
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
      description: "- Verify your Kubernetes configuration files @",
      shortName: "kubeconform",
      url: " https://github.com/yannh/kubeconform",
    },
    {
      action: "Clean",
      description: "- Remove clutter from your Kubernetes manifests @",
      shortName: "kubectl-neat",
      url: " https://github.com/itaysk/kubectl-neat",
    },
    {
      action: "Secure",
      description: "- Scan your YAML code for security vulnerabilities @",
      shortName: "trivy",
      url: " https://github.com/aquasecurity/trivy",
    },
    {
      action: "Audit",
      description: "-Validation of best practices for your yaml @",
      shortName: "polaris",
      url: " https://github.com/FairwindsOps/polaris",
    },
    {
      action: "Secure",
      description:
        "-Scan your YAML file for Devops best practices and security vulnerabilities @",
      shortName: "kubescape",
      url: " https://github.com/armosec/kubescape",
    },
    {
      action: "SBOM",
      description: "- Scan your container image for SBoMs @",
      shortName: "trivy",
      url: " https://github.com/aquasecurity/trivy",
    },
  ];
  return (
    <HeaderContainer>
      <MainDiv>
        <StyledHeadline>About this project</StyledHeadline>
        <br />
        <div>
          ValidKube combines the best open-source tools to help ensure
          Kubernetes YAML best practices, hygiene & security.
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
          Validkube is an{" "}
          <CustomLink
            href={GITHUB_REPO_VALIDKUBE}
            target={GITHUB_REPO_VALIDKUBE}
          >
            open-source
          </CustomLink>{" "}
          site, so please feel free to add more tools or capabilities. :)
        </div>
        <br />
        <div style={{ wordBreak: "break-word" }}>
          Looking for Infrastructure-as-Code validation tool? check out{" "}
          <CustomLink
            href="https://www.validiac.com/"
            target="https://www.validiac.com/"
          >
            validiac.com
          </CustomLink>
        </div>
        <br />
        <BrOnlyOnPc />
      </MainDiv>
    </HeaderContainer>
  );
};
