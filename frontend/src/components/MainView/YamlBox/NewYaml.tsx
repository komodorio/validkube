import React from "react";
import styled from "styled-components";
import {
  copyContentToClipboard,
  downloadContentToTextFile,
} from "../../../utils/browserActions";
import { pinkForText } from "../../../utils/Colors";
import { BlackTransparentButton } from "../../GenericComponents/BlackTransparentButton";
import { LinesLoader } from "../../GenericComponents/LineLoader";
import { TabButtons } from "../../GenericComponents/Tabs";
import { SmallBr } from "../AboutThisProject";
import {
  CodeEditorContainer,
  StyledHr,
  TextAreaContainer,
} from "./YamlBoxComponents";
import { StreamLanguage } from "@codemirror/stream-parser";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import CodeMirror from "@uiw/react-codemirror";
import { komodo } from "./CodemirrorKomodorTheme";
import { EditorView } from "@codemirror/view";
export const API_ENDPOINTS = [
  "kubeconform",
  "kubeneat",
  "trivy/config",
  "polaris",
  "kubescape",
  "trivy/sbom",
];

const Container = styled.div``;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 1rem;
  padding: 1rem;
`;

const ErrorAndLoadingContainer = styled.div`
  height: 450px;
  @media (max-width: 74rem) {
    height: 250px;
  }
  width: -webkit-fill-available;
  margin: 0;
  padding: 1rem;
  margin-top: 0.4rem;
`;

const ErrorContainer = styled(ErrorAndLoadingContainer)`
  color: white;
  text-align: left;
`;

const LoadingContainer = styled(ErrorAndLoadingContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.div`
  font-weight: 500;
  font-family: "Roboto mono";
`;

const ErrorTextPink = styled(ErrorText)`
  color: ${pinkForText};
`;

interface NewYamlProps {
  yamlOutput: string;
  fetching: boolean;
  err: any;
  callApiCallback: (endpoint: string) => void;
  curTab: number;
  setCurTab: React.Dispatch<React.SetStateAction<number>>;
}

const NewYaml: React.FC<NewYamlProps> = ({
  yamlOutput,
  fetching,
  err,
  callApiCallback,
  curTab,
  setCurTab,
}) => {
  const tabs = [
    "Validate",
    "Clean",
    "Secure (Trivy)",
    "Audit (Polaris)",
    "Secure (Kubescape)",
    "SBOM (Trivy)",
  ];

  return (
    <Container>
      <TabButtons
        tabs={tabs}
        currentTabIndex={curTab}
        onTabClick={(selectedTab) => {
          setCurTab(selectedTab);
          callApiCallback(API_ENDPOINTS[selectedTab]);
        }}
      />
      <TextAreaContainer>
        {fetching ? (
          <LoadingContainer>
            <LinesLoader />
          </LoadingContainer>
        ) : err ? (
          <ErrorContainer>
            <ErrorTextPink>something's not working</ErrorTextPink>
            <SmallBr />
            <ErrorText>{err.toString()}</ErrorText>
          </ErrorContainer>
        ) : (
          <CodeEditorContainer>
            <CodeMirror
              value={yamlOutput}
              extensions={[
                komodo,
                StreamLanguage.define(yaml),
                EditorView.lineWrapping,
              ]}
              placeholder="here is where the magic happens"
              theme={"dark"}
              editable={true}
            />
          </CodeEditorContainer>
        )}
        <StyledHr />
        <ButtonsContainer>
          <BlackTransparentButton
            onClick={() =>
              downloadContentToTextFile(yamlOutput, "new_yaml.yaml")
            }
          >
            Download
          </BlackTransparentButton>
          <BlackTransparentButton
            onClick={() => copyContentToClipboard(yamlOutput)}
          >
            Copy
          </BlackTransparentButton>
        </ButtonsContainer>
      </TextAreaContainer>
    </Container>
  );
};

export default NewYaml;
