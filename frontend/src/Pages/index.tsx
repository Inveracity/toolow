import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import NormalizeTab from "./TabNormalize";

const TabMenu = () => {
  return (
    <Tabs variant='soft-rounded' colorScheme='green'>
      <TabList>
        <Tab>Normalize</Tab>
        <Tab>Replace</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <NormalizeTab />
        </TabPanel>
        <TabPanel>
          <p>Todo!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default TabMenu
