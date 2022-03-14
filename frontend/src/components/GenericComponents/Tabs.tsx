import styled from "styled-components";
import { blueForButton } from "../../utils/Colors";

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
`;

const Tab = styled.div<{ selected: boolean }>`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0;
  margin-inline-end: 2rem;
  color: white;
  opacity: ${({ selected }) => (selected ? "1" : ".7")};
  font-family: Poppins;
  padding: 0.1rem 0.3rem;
  cursor: pointer;
  transition: border .3s ease;
  font-weight: ${({ selected }) => (selected ? "500" : "500")};
  border-bottom: 3px solid
    ${({ selected }) => (selected ? `${blueForButton}` : "transparent")};
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
