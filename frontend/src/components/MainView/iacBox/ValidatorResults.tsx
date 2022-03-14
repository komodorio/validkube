import React from "react";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import {
  copyContentToClipboard,
  downloadContentToTextFile,
} from "../../../utils/browserActions";
import { pinkForText } from "../../../utils/Colors";
import { BlackTransparentButton } from "../../GenericComponents/BlackTransparentButton";
import { Loader } from "../../GenericComponents/loader/Loader";
import { TabButtons } from "../../GenericComponents/Tabs";
import { SmallBr } from "../AboutThisProject";
import {
  CodeEditorContainer,
  StyledHr,
  TextAreaContainer,
  StyledTextAreaCss,
  InfraMapCss
} from "./IacBoxComponents";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Graphviz } from 'graphviz-react';
import Empty from '../assets/empty.png';
export const API_ENDPOINTS = ["lint", "secure", "cost", "map"];
const tabs = ["Validate", "Secure", "Cost", "Map"];

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

interface ResultsProps {
  output: string;
  fetching: boolean;
  err: any;
  callApiCallabck: (endpoint: string) => void;
  curTab: number;
  setCurTab: React.Dispatch<React.SetStateAction<number>>;
}

const ValidatorResults: React.FC<ResultsProps> = ({
  output,
  fetching,
  err,
  callApiCallabck,
  curTab,
  setCurTab,
}) => {
  return (
    <Container>
      <TabButtons
        tabs={tabs}
        currentTabIndex={curTab}
        onTabClick={(selectedTab) => {
          setCurTab(selectedTab);
          callApiCallabck(API_ENDPOINTS[selectedTab]);
        }}
      />
      <TextAreaContainer>
        {fetching ? (
          <LoadingContainer>
            <Loader />
          </LoadingContainer>
        ) : err ? (
          <ErrorContainer>
            <ErrorTextPink>something's not working</ErrorTextPink>
            <SmallBr />
            <ErrorText>{err.toString()}</ErrorText>
          </ErrorContainer>
        ) : (
          <>
            <CodeEditorContainer>
              {tabs[curTab] == "Map" && !isEmpty(output) ?
                // Graph is empty
                output.replace(/\n/g, '') == "strict digraph G {}" ?
                  <div style={{ alignItems: "center", justifyContent: "center", display: "flex", height: "100%" }}>
                    <img src={Empty} style={{ alignItems: "center", justifyContent: "center" }} />
                  </div> :
                  // Rendering Graph
                  <Graphviz dot={output} /> :
                <CodeEditor
                  language="bash"
                  value={output}
                  placeholder="here is where the magic happens"
                  padding={15}
                  style={StyledTextAreaCss}
                />
              }
            </CodeEditorContainer>
          </>
        )}
        <StyledHr />
        <ButtonsContainer>
          <BlackTransparentButton
            onClick={() =>
              downloadContentToTextFile(output, "result.txt")
            }
          >
            Download
          </BlackTransparentButton>
          <BlackTransparentButton
            onClick={() => copyContentToClipboard(output)}
          >
            Copy
          </BlackTransparentButton>
        </ButtonsContainer>
      </TextAreaContainer>
    </Container>
  );
};

export default ValidatorResults;
