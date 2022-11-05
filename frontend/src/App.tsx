import { useState } from 'react';
import { Videofile, Volume } from "../wailsjs/go/main/App";
import { Box, Button, Stack, Text, Image, Divider } from "@chakra-ui/react"
import banner from "./assets/banner.png"


function App() {
  const [maxVolume, setMaxVolume] = useState('');
  const [meanVolume, setMeanVolume] = useState('');
  const [file, setFile] = useState('');

  function getVideoFile() {
    Videofile().then((v) => {
      setFile(v)
    })
  }

  function getVolume(filepath: string) {
    Volume(filepath).then((v) => {
      setMaxVolume(v[0])
      setMeanVolume(v[1])
    })
  }

  function clear() {
    setFile("")
    setMaxVolume("-")
    setMeanVolume("-")
  }

  return (
    <Box height={"100vh"} bg="brand.bg">
      <Banner />

      <Box display="flex" justifyContent="center" width={"100vw"}>
        <Stack width={"70vw"}>
          <Stack direction={"row"} justify="space-between">
            <Button bgColor={"brand.300"} width="140px" onClick={getVideoFile}>Select video file</Button>
            <Button bgColor={"brand.300"} width="140px" onClick={clear}>Clear</Button>
          </Stack>
          <Text textColor="brand.white">{file}</Text>
          {
            file
              ? <>
                <Button onClick={(_) => getVolume(file)}>Analyze</Button>
                <Stack direction={"row"}>
                  <Text textColor={'brand.white'}>max volume:</Text>
                  <Text textColor={'brand.400'}>{maxVolume}</Text>
                </Stack>
                <Stack direction={"row"}>
                  <Text textColor={'brand.white'}>mean volume:</Text>
                  <Text textColor={'brand.400'}>{meanVolume}</Text>
                </Stack>
              </>
              : null
          }
        </Stack>
      </Box>
    </Box >
  )
}

export default App

const Banner = () => {
  return (
    <Box display="flex" bg="brand.bg" justifyContent="center">
      <Image src={banner} height="50px" margin={"10px"} />
    </Box>
  )
}
