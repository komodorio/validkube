import React from "react";
import styled from "styled-components";
import { mainBackgrund } from "../../utils/Colors";
import { FIREFLY_APP } from "./MainViewHeader";
import { ReactComponent as Firefly } from "./assets/Firefly.svg";

const Content = styled.div`
  padding: 20px;
  background-color: ${mainBackgrund};
  position: fixed;
  bottom: 0;
  width: 40%;
  left: 50%;
  height: 15%;
  transform: translate(-50%, -5%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: Poppins;
`;

const Title = styled.div`
  font-weight: 500;
  text-align: left;
  font-size: 22px;
  color: white;
`;

const LinkContainer = styled.div`
  justify-content: center;
  display: flex;
`;

const Link = styled.div`
  text-align: center;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  color: #305bbb;
  width: fit-content;
`;
const CloseBtnContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseBtn = styled.button`
  font-family: Poppins;
  background-color: ${mainBackgrund};
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
`;

interface FireflyPopupProps {
  onClose: () => void;
  style: Object;
}

const FireflyPopup: React.FC<FireflyPopupProps> = ({
  onClose,
  style
}) => {
  return (
    <Content 
    style={style}
    >
      <Title>Tired of manually codifying HCL?</Title>
      <LinkContainer>
        <Link onClick={() => {
          window.open(FIREFLY_APP); 
          onClose();
        }}>
          Go to Firefly
          <Firefly style={{height: "30px", width: "50px"}} />
        </Link>
      </LinkContainer>
      <CloseBtnContainer>
        <CloseBtn onClick={onClose}>Close</CloseBtn>
      </CloseBtnContainer>
    </Content>
  );
};

export default FireflyPopup;
