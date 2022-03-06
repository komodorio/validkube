import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BlackTransparentButton } from "../../GenericComponents/BlackTransparentButton";
import { BlueButton } from "../../GenericComponents/BlueButton";
import { SUBNET_TERRAFORM } from "../manifest/manifest_examples";
import { API_ENDPOINTS } from "./ValidatorResults";
import CodeEditor from "@uiw/react-textarea-code-editor";

import {
  CodeEditorContainer,
  StyledHr,
  StyledTextAreaCss,
  TextAreaContainer,
} from "./IacBoxComponents";

const Header = styled.div`
  color: white;
  font-weight: 500;
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

interface ExistingHclProps {
  callApiCallabck: (endpoint: string) => void;
  setExistingHclTextArea: React.Dispatch<React.SetStateAction<string>>;
  curTab: number;
}

const ExistingHcl: React.FC<ExistingHclProps> = ({
  setExistingHclTextArea,
  callApiCallabck,
  curTab,
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>();
  const setExampleCallback = useCallback(() => {
    setTextAreaValue(SUBNET_TERRAFORM);
    setExistingHclTextArea(SUBNET_TERRAFORM);
  }, [setExistingHclTextArea]);

  return (
    <div style={{ width: '100%' }}>
      <Header>Enter Terraform code</Header>
      <br />
      <TextAreaContainer>
        <CodeEditorContainer>
          <CodeEditor
            language="js"
            placeholder="drop your Infrastructure-as-Code here"
            value={textAreaValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => {
              setExistingHclTextArea(e.target.value);
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

export default ExistingHcl;
