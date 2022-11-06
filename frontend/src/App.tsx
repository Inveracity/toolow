import { useState } from 'react';
import { Normalize, Videofile, Volume } from "../wailsjs/go/main/App";
import { Box, Button, Stack, Text, Image, Progress, Divider } from "@chakra-ui/react"
import banner from "./assets/banner.png"


function App() {
  const [maxVolume, setMaxVolume] = useState('');
  const [meanVolume, setMeanVolume] = useState('');
  const [file, setFile] = useState('');
  const [normalizedFile, setNormalized] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function getVideoFile() {
    Videofile().then((v) => {
      setFile(v)
    })
  }

  function getVolume(filepath: string) {
    Volume(filepath).then((v) => {
      setMaxVolume(v.Max)
      setMeanVolume(v.Mean)
    })
  }

  function clear() {
    setFile("")
    setMaxVolume("-")
    setMeanVolume("-")
  }

  function normalize(filepath: string) {
    setIsLoading(true)
    Normalize(filepath)
      .then((result) => {
        console.log(result)
        setNormalized(result.Outfile)
        setMaxVolume(result.Max)
        setMeanVolume(result.Mean)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Box height={"100vh"} bg="brand.bg">
      <Banner />
      {isLoading ? <Progress height="5px" mt="5px" mb="5px" isIndeterminate color="brand.200" /> : <Divider height="5px" mt="5px" mb="5px" />}
      <Box display="flex" justifyContent="center" width={"100vw"}>
        <Stack width={"70vw"}>
          <Stack direction={"row"} justify="space-between">
            <Button bgColor={"brand.300"} width="140px" onClick={getVideoFile}>Select video file</Button>
            <Button bgColor={"brand.300"} width="140px" onClick={clear}>Clear</Button>
          </Stack>
          <Text textColor="brand.white">In:  {file}</Text>
          <Text textColor="brand.white">Out: {normalizedFile}</Text>
          {
            file
              ? <>
                <Stack direction={"row"} justify="space-between">
                  <Button width="140px" onClick={(_) => getVolume(file)}>Analyze</Button>
                  <Button width="140px" onClick={(_) => normalize(file)}>Normalize Audio</Button>
                </Stack>
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
      <Image src={banner} height="50px" mt="15px" />
    </Box>
  )
}
