import { Box } from "@chakra-ui/react"
import TabMenu from './Pages';
import Banner from "./Components/Banner"

function App() {
  return (
    <Box height="100vh">
      <Banner />
      <TabMenu />
    </Box>
  )
}

export default App
