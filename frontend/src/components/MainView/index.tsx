import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { callAPI } from "../../services/api-service";
import MainViewHeader from "./MainViewHeader";
import {
  AboutThisProjectBottom,
  AboutThisProjectHeader,
} from "./AboutThisProject";
import ExistingHcl from "./iacBox/ExistingHcl";
import ValidatorResults from "./iacBox/ValidatorResults";
import FireflyPopup from "./FireflyPopup";

const TextaresContainer = styled.div`
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
`;

const MainViewBodyContainer = styled.div`
  overflow-y: auto;
`;

export const BrOnlyOnPc = styled.br`
  @media (max-width: 74rem) {
    display: none;
  }
`;

const MainView: React.FC = () => {
  const [existingHclTextArea, setExistingHclTextArea] = useState("");
  const [output, setOutput] = useState<any>();
  const [fetching, setFetching] = useState(false);
  const [err, setErr] = useState<any>();
  const [curTab, setCurTab] = useState<number>(0);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [initialTabClicked, setInitialTabClicked] = useState<boolean>(false);
  const [popupStyle, setPopupStyle] = useState<Object>({
      opacity: 0,
      transition: "all 0.3s ease-in"
    });

  const callApiCallabck = useCallback(
    (endpoint: string) => {
      if (!existingHclTextArea || existingHclTextArea === "") return;
      callAPI(
        endpoint,
        {
          hcl: existingHclTextArea,
        },
        setOutput,
        setFetching,
        setErr
      );
    },
    [existingHclTextArea]
  );

  useEffect(() => {
    if (initialTabClicked) {
      setPopupOpen(true);
    }
  }, [initialTabClicked]);

  useEffect(() => {
    if (popupOpen) {
      setPopupStyle({
        opacity: 1,
        transition: "all 0.3s ease-in"
      });
    } else {
      setPopupStyle({
        opacity: 0,
        transition: "all 0.3s ease-in"
      });
    }
    
  }, [popupOpen]);

  const handleClose = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <MainViewHeader />
      <MainViewBodyContainer>
        <BrOnlyOnPc />
        <TextaresContainer>
          <ExistingHcl
            callApiCallabck={callApiCallabck}
            setExistingHclTextArea={setExistingHclTextArea}
            curTab={curTab}
          />
          <ValidatorResults
            output={output?.toString()}
            fetching={fetching}
            err={err}
            callApiCallabck={callApiCallabck}
            curTab={curTab}
            setCurTab={setCurTab}
            setInitialTabClicked={setInitialTabClicked}
            initialTabClicked={initialTabClicked}
          />
        </TextaresContainer>
        <BrOnlyOnPc />
      </MainViewBodyContainer>
      <AboutThisProjectHeader />
      <AboutThisProjectBottom />
      <FireflyPopup onClose={handleClose} style={popupStyle} />
    </>
  );
};

export default MainView;
