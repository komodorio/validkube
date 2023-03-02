import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { callAPI } from "../../services/api-service";
import MainViewHeader from "./MainViewHeader";
import {
  AboutThisProjectBottom,
  AboutThisProjectHeader,
} from "./AboutThisProject";
import MyYaml from "./YamlBox/ExistingYaml";
import NewYaml from "./YamlBox/NewYaml";

const TextAreaContainer = styled.div`
  display: grid;
  grid-column-gap: 4rem;
  grid-row-gap: 3rem;
  align-items: self-end;
  @media (min-width: 74rem) {
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    grid-auto-flow: column;
  }
  padding: 2% 8% 3% 8%;
  @media only screen and (max-width: 600px){
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2% 0 3%;
  }
`;

const MainViewBodyContainer = styled.div`
  overflow-y: auto;
  background-color: ${(props) => props.theme.mainBgColor};
`;

export const BrOnlyOnPc = styled.br`
  @media (max-width: 74rem) {
    display: none;
  }
`;

const MainView: React.FC = () => {
  const [existingYamlTextArea, setExistingYamlTextArea] = useState("");
  const [output, setOutput] = useState<any>();
  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState<any>();
  const [curTab, setCurTab] = useState<number>(0);

  const callApiCallback = useCallback(
    (endpoint: string) => {
      if (!existingYamlTextArea || existingYamlTextArea === "") return;
      callAPI(
        endpoint,
        {
          yaml: existingYamlTextArea,
        },
        setOutput,
        setFetching,
        setErr
      );
    },
    [existingYamlTextArea]
  );

  return (
    <>
      <MainViewHeader />
      <MainViewBodyContainer>
        <BrOnlyOnPc />
        <TextAreaContainer>
          <MyYaml
            callApiCallback={callApiCallback}
            setExistingYamlTextArea={setExistingYamlTextArea}
            curTab={curTab}
          />
          <NewYaml
            yamlOutput={output?.toString()}
            fetching={fetching}
            err={err}
            callApiCallback={callApiCallback}
            curTab={curTab}
            setCurTab={setCurTab}
          />
        </TextAreaContainer>
        <BrOnlyOnPc />
      </MainViewBodyContainer>
      <AboutThisProjectHeader />
      <AboutThisProjectBottom />
    </>
  );
};

export default MainView;
