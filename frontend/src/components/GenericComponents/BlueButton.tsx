import styled from "styled-components";
import { blueForButton } from "../../utils/Colors";

export const BlueButton = styled.button`
  background-color: ${blueForButton};
  border: 1px solid ${blueForButton};
  display: grid;
  width: width: fit-content;;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: white;
  font-family: "Roboto";
  padding: 0.4rem 1rem;
  border-radius: 2px;
`;
