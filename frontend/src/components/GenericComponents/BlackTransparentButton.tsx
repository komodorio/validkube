import styled from "styled-components";
import { mainBackground } from "../../utils/Colors";

export const BlackTransparentButton = styled.button`
  background-color: ${mainBackground};
  border: 1px solid white;
  display: grid;
  width: fit-content;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: white;
  font-family: "Roboto";
  padding: 0.4rem 1rem;
  border-radius: 2px;
`;
