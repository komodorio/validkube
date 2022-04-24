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
import './ChartApp.css';
export const API_ENDPOINTS = ["lint", "secure", "cost", "map"];
const tabs = ["Validate", "Secure", "Cost", "Map"];

const Container = styled.div`
width: 100%;
`;

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
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LoadingContainer = styled(ErrorAndLoadingContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.div`
  font-weight: 400;
  font-family: "Roboto mono";
  font-size: 14px;
`;

const ErrorTextPink = styled(ErrorText)`
  color: ${pinkForText};
  font-weight: bold;
  font-size: 16px;
`;

interface ResultsProps {
  output: string;
  fetching: boolean;
  err: any;
  callApiCallabck: (endpoint: string) => void;
  curTab: number;
  setCurTab: React.Dispatch<React.SetStateAction<number>>;
  setInitialTabClicked: React.Dispatch<React.SetStateAction<boolean>>
  initialTabClicked: boolean;
}

const ValidatorResults: React.FC<ResultsProps> = ({
  output,
  fetching,
  err,
  callApiCallabck,
  curTab,
  setCurTab,
  setInitialTabClicked,
  initialTabClicked,
}) => {
  return (
    <Container>
      <TabButtons
        tabs={tabs}
        currentTabIndex={curTab}
        onTabClick={(selectedTab) => {
          setCurTab(selectedTab);
          callApiCallabck(API_ENDPOINTS[selectedTab]);
          if (!initialTabClicked) {
            setInitialTabClicked(true);
          }
        }}
      />
      <TextAreaContainer>
        {fetching ? (
          <LoadingContainer>
            <Loader />
          </LoadingContainer>
        ) : err ? (
          <ErrorContainer>
            <ErrorTextPink>Something's not working</ErrorTextPink>
            <SmallBr />
            <ErrorText>{err.toString()}</ErrorText>
          </ErrorContainer>
        ) : (
          <>
            <CodeEditorContainer>
              {tabs[curTab] == "Map" && !isEmpty(output) ?
                // Graph is empty
                output.replace(/\n/g, '') == "strict digraph G {}" ?
                  <div style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", gap: '20px', height: "100%", padding: '20px'}}>
                    <img src={Empty} style={{ alignItems: "center", justifyContent: "center", height: '80px' }} />
                    <span style={{ color: 'white', opacity: '.7', textAlign: 'center' }}>Sorry. inframap doesn’t support this terraform code</span>
                  </div> :
                  // Rendering Graph
                  <Graphviz dot={output} className="map-chart" options={{
                  height: '80%',
                  width: '80%',
                  zoom: true,
                  }} /> :
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
