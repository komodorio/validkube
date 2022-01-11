import React, { Fragment } from "react";
import styled from "styled-components";
import { purpleBackground } from "../../utils/Colors";
import { ReactComponent as CheckIcon } from "./assets/Check.svg";
import { ReactComponent as GitIcon } from "./assets/GitIcon.svg";
import { ReactComponent as KomodorLogo } from "./assets/KomodorLogo.svg";
import { ReactComponent as DotIcon } from "./assets/DotIcon.svg";
import { ReactComponent as BackArrow } from "./assets/BackArrow.svg";
import { KOMODOR_COM } from "./MainViewHeader";

const GITHUB_REPO_VALIDKUBE = "https://github.com/komodorio/validkube";

const Container = styled.div`
  color: white;
  text-align: center;
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
`;

const MainDiv = styled.div`
  @media (min-width: 74rem) {
    width: 50%;
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
  display: flex;
`;

const CheckIconContainer = styled.div`
  > svg {
    vertical-align: center;
    width: 1rem;
    padding-right: 0.6rem;
  }
`;
const GitconWithTextContainer = styled.div`
  width: initial;
  display: grid;
  grid-template-columns: 0.1fr 0.1fr auto;
  @media (max-width: 74rem) {
    display: flex;
  }
  > svg {
    vertical-align: bottom;
    width: 2.1rem;
    padding-right: 0.4rem;
  }
`;

const ArrowContainer = styled.div`
  margin-right: -0.6rem;
  > svg {
    vertical-align: bottom;
    width: 1rem;
  }
`;

const CustomLink = styled.a`
  text-decoration: none;
  color: black;
  background-color: white;
  padding: 0.4rem;
  font-family: Roboto;
  font-size: 12px;
  align-self: center;
  border-radius: 3px;
  display: block;
  width: 10rem;
`;

export const SmallBr = styled.span`
  display: block;
  margin: 10px 0;
`;

const PolicyContainer = styled.div`
  display: flex;
  width: 70%;
  gap: 1rem;
  margin-block-end: 0rem;
  align-items: center;
  @media (max-width: 30rem) {
    gap: 0.5rem;
  }
`;

const CursorPointerWrapper = styled.div`
  cursor: pointer;
`;

const OpensourceSingleContainer = styled.div`
  display: grid;
  grid-row-gap: 1rem;
`;

const OpensourceContainer = styled.div`
  padding-right: 7rem;
  @media (max-width: 74rem) {
    padding-right: 3rem;
  }
`;

const MobileWrapper = styled.div`
  @media (max-width: 30rem) {
    display: none;
  }
`;

const PCWrapper = styled.div`
  @media (min-width: 30rem) {
    display: none;
  }
`;

export const AboutThisProjectBottom: React.FC = () => (
  <BottomContainer>
    <PolicyContainer>
      <div>© Komodor 2022</div>
      <DotIcon />
      <CursorPointerWrapper onClick={() => window.open(GITHUB_REPO_VALIDKUBE)}>
        <MobileWrapper>Validkube on Github</MobileWrapper>
        <PCWrapper>GitHub</PCWrapper>
      </CursorPointerWrapper>
      <MobileWrapper>
        <DotIcon />
      </MobileWrapper>
      <MobileWrapper>Terms of use</MobileWrapper>
    </PolicyContainer>
    <CursorPointerWrapper style={{ marginTop: "5px" }}>
      <KomodorLogo onClick={() => window.open(KOMODOR_COM)} />
    </CursorPointerWrapper>
  </BottomContainer>
);

export const AboutThisProjectHeader: React.FC = () => {
  const checks: string[] = [
    "Metadata such as creation timestamp, or some internal IDs",
    "Fill in for missing attributes with default values",
    "Additional system attributes created by admission controllers, such as service account token",
    "Fill in for missing attributes with default values",
  ];

  const gitProjects: {
    name: string;
    url: string;
  }[] = [
    {
      name: "View kube-neat on Github",
      url: "https://github.com/itaysk/kubectl-neat",
    },
    {
      name: "View kubeval on Github",
      url: "https://github.com/instrumenta/kubeval",
    },
    {
      name: "View trivy on Github",
      url: "https://github.com/aquasecurity/trivy",
    },
  ];
  return (
    <HeaderContainer>
      <MainDiv>
        <StyledHeadline>About this project</StyledHeadline>
        <br />
        <div>
          When you create a Kubernetes resource, let's say a Pod, Kubernetes
          adds a whole bunch of internal system information to the yaml or json
          that you originally authored.
        </div>
        <br />
        <StyledH4>This includes:</StyledH4>
        <SmallBr />
        {checks.map((checkString, index) => (
          <Fragment key={index}>
            <CheckIconWithTextContainer>
              <CheckIconContainer>
                <CheckIcon />
              </CheckIconContainer>
              {checkString}
            </CheckIconWithTextContainer>
            <SmallBr />
          </Fragment>
        ))}
      </MainDiv>
      <OpensourceContainer>
        <StyledH4>Validkube is brought to you using:</StyledH4>
        <br />
        <OpensourceSingleContainer>
          {gitProjects.map((proj, index) => (
            <GitconWithTextContainer key={index}>
              <GitIcon />
              <ArrowContainer>
                <BackArrow />
              </ArrowContainer>
              <CustomLink href={proj.url} target={proj.url}>
                {proj.name}
              </CustomLink>
            </GitconWithTextContainer>
          ))}
        </OpensourceSingleContainer>
        <br />
      </OpensourceContainer>
    </HeaderContainer>
  );
};
