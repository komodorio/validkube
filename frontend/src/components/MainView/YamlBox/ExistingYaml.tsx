import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { BlackTransparentButton } from "../../GenericComponents/BlackTransparentButton";
import { BlueButton } from "../../GenericComponents/BlueButton";
import { NGINX_YAML } from "../manifest/manifest_examples";
import { API_ENDPOINTS } from "./NewYaml";
import CodeMirror from "@uiw/react-codemirror";
import { komodo } from "./CodemirrorKomodorTheme";
import { EditorView } from "@codemirror/view";

import {
  CodeEditorContainer,
  StyledHr,
  TextAreaContainer,
} from "./YamlBoxComponents";
import { StreamLanguage } from "@codemirror/stream-parser";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

const Header = styled.div`
  color: ${(props) => props.theme.text};
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
  callApiCallback: (endpoint: string) => void;
  setExistingYamlTextArea: React.Dispatch<React.SetStateAction<string>>;
  curTab: number;
}

const MyYaml: React.FC<MyYamlProps> = ({
  setExistingYamlTextArea,
  callApiCallback,
  curTab,
}) => {
  const [textAreaValue, setTextAreaValue] = useState<string>();
  const setExampleCallback = useCallback(() => {
    setTextAreaValue(NGINX_YAML);
    setExistingYamlTextArea(NGINX_YAML);
  }, [setExistingYamlTextArea]);

  return (
    <div>
      <Header>Enter a K8s YAML</Header>
      <br />
      <TextAreaContainer>
        <CodeEditorContainer>
          <CodeMirror
            placeholder="drop your existing yaml here"
            value={textAreaValue}
            onChange={(value, viewUpdate) => {
              setExistingYamlTextArea(value);
              setTextAreaValue(value);
            }}
            extensions={[
              komodo,
              StreamLanguage.define(yaml),
              EditorView.lineWrapping,
            ]}
            theme={"dark"}
            editable={true}
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
          <BlueButton onClick={() => callApiCallback(API_ENDPOINTS[curTab])}>
            Run
          </BlueButton>
        </ButtonsContainer>
      </TextAreaContainer>
    </div>
  );
};

export default MyYaml;
