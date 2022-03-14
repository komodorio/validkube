import styled from "styled-components";
import { secondBtnColor, secondBtnBackground } from "../../utils/Colors";

export const BlackTransparentButton = styled.button`
  background-color: ${secondBtnBackground};
  border: 1px solid transparent;
  display: grid;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 400;
  cursor: pointer;
  color: ${secondBtnColor};
  font-family: "Roboto";
  padding: 0.4rem 1rem;
  border-radius: 4px;
`;
