import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BlackTransparentButton } from "../../GenericComponents/BlackTransparentButton";
import { BlueButton } from "../../GenericComponents/BlueButton";
import { SUBNET_TERRAFORM } from "../manifest/manifest_examples";
import { API_ENDPOINTS } from "./NewYaml";
import CodeEditor from "@uiw/react-textarea-code-editor";

import {
  CodeEditorContainer,
  StyledHr,
  StyledTextAreaCss,
  TextAreaContainer,
} from "./YamlBoxComponents";

const Header = styled.div`
  color: white;
  font-weight: 700;
  font-family: Poppins;
  text-align: left;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const LeftButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

interface MyYamlProps {
  callApiCallabck: (endpoint: string) => void;
  setExistingYamlTextArea: React.Dispatch<React.SetStateAction<string>>;
  curTab: number;
}

const MyYaml: React.FC<MyYamlProps> = ({
  setExistingYamlTextArea,
  callApiCallabck,
  curTab,
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>();
  const setExampleCallback = useCallback(() => {
    setTextAreaValue(SUBNET_TERRAFORM);
    setExistingYamlTextArea(SUBNET_TERRAFORM);
  }, [setExistingYamlTextArea]);

  return (
    <div>
      <Header>Enter Terraform code</Header>
      <br />
      <TextAreaContainer>
        <CodeEditorContainer>
          <CodeEditor
            language="hvl"
            placeholder="drop your Infrastructure-as-Code here"
            value={textAreaValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
              setExistingYamlTextArea(e.target.value);
              setTextAreaValue(e.target.value);
            }}
            padding={15}
            style={StyledTextAreaCss}
          />
        </CodeEditorContainer>
        <StyledHr />
        <ButtonsContainer>
          <LeftButtonsContainer>
            <BlackTransparentButton onClick={() => setExampleCallback()}>
              Example
            </BlackTransparentButton>
            <BlackTransparentButton onClick={() => setTextAreaValue("")}>
              Clear
            </BlackTransparentButton>
          </LeftButtonsContainer>
          <BlueButton onClick={() => callApiCallabck(API_ENDPOINTS[curTab])}>
            Run
          </BlueButton>
        </ButtonsContainer>
      </TextAreaContainer>
    </div>
  );
};

export default MyYaml;
