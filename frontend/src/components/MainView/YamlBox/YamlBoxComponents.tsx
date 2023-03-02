import styled from "styled-components";
import { greyBorder, mainBackground } from "../../../utils/Colors";

export const StyledTextArea = styled.textarea`
  height: 450px;
  @media (max-width: 74rem) {
    height: 250px;
  }
  width: -webkit-fill-available;
  line-height: 1.45;
  resize: none;
  background-color: ${mainBackground};
  color: white;
  font-size: 14px;
  border: hidden;
  padding: 1rem;
  font-family: "Roboto Mono";
`;

export const StyledTextAreaCss = {
  fontSize: 14,
  fontFamily: "Roboto Mono",
  minHeight: 483,
  color: "#90a4ae",
};

export const TextAreaContainer = styled.div`
  border: 1px solid ${greyBorder};
  width: 100%;
  @media only screen and (max-width: 600px){
    width: 85vw;
  }
`;

export const StyledHr = styled.hr`
  border-top: 0.2px solid ${greyBorder};
  border-bottom: hidden;
  margin: 0;
`;

export const CodeEditorContainer = styled.div`
  height: 483px;
  overflow: auto;
  @media (max-width: 74rem) {
    height: 250px;
  }
`;
