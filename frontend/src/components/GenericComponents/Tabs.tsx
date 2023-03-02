import styled from "styled-components";
import { blueForButton } from "../../utils/Colors";

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media only screen and (max-width: 600px){
    width: 85vw;
    overflow-x: scroll;
  }  
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.div<{ selected: boolean }>`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  margin-inline-end: 2rem;
  color: ${(props) => props.theme.text};
  font-family: Poppins;
  padding: 0.5rem 0;
  cursor: pointer;
  font-weight: ${({ selected }) => (selected ? "700" : "500")};
  border-bottom: 4px solid
    ${({ selected }) => (selected ? `${blueForButton}` : "none")};
`;

export const TabButtons: React.FC<{
  tabs: string[];
  currentTabIndex: number;
  onTabClick: (selectedTab: number) => void;
}> = ({ tabs, currentTabIndex, onTabClick }) => {
  return (
    <TabsContainer>
      {tabs.map((t, i) => (
        <Tab
          key={i}
          selected={currentTabIndex === i}
          onClick={() => onTabClick(i)}
        >
          {t}
        </Tab>
      ))}
    </TabsContainer>
  );
};
