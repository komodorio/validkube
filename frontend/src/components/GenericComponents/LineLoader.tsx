import React from "react";
import styled from "styled-components";

const Line = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  background-color: #4b9cdb;

  &:nth-last-child(1) {
    background-color: #3fe6dc;
    animation: loadingB 1.5s 1s infinite;
  }
  &:nth-last-child(2) {
    background-color: #fc1683;
    animation: loadingB 1.5s 0.5s infinite;
  }
  &:nth-last-child(3) {
    background-color: #0038ff;
    animation: loadingB 1.5s 0s infinite;
  }

  @keyframes loadingB {
    0 {
      width: 1rem;
    }
    50% {
      width: 2rem;
    }
    100% {
      width: 1rem;
    }
  }
`;

export const LinesLoader: React.FC = () => (
  <>
    <Line />
    <Line />
    <Line />
  </>
);
