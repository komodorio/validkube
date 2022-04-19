import React from "react";
import Dialog from '@mui/material/Dialog';
import styled from "styled-components";

const Content = styled.div`
  padding: 20px;
`;

const Title = styled.div`
  font-weight: 500;
  font-family: Poppins;
  text-align: left;
  font-size: 22px;
  color: #0d0534;
`;

const LinkContainer = styled.div`
  margin-top: 8%;
  text-align: center; 
`;

const Link = styled.a`
  font-size: 22px;
  font-family: Poppins;
  color: #305bbb;
  text-decoration: none;
`;

interface FireflyPopupProps {
  open: boolean;
  onClose: () => void;
}

const FireflyPopup: React.FC<FireflyPopupProps> = ({
  onClose, open
}) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <Content>
        <Title>Tired of manually codifying HCL?</Title>
        <LinkContainer>
          <Link href="https://app.gofirefly.io/" target="_blank" rel="noreferrer">Go to Firefly</Link>
        </LinkContainer>
      </Content>
    </Dialog>
  );
};

export default FireflyPopup;
