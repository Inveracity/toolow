import { useState } from 'react';
import { Normalize, Videofile, Volume } from "../wailsjs/go/main/App";
import { Box, Button, Stack, Text, Image, Progress, Divider, Collapse } from "@chakra-ui/react"
import banner from "./assets/banner.png"
import { EventsOff, EventsOn } from "../wailsjs/runtime"

function App() {
  const [maxVolume, setMaxVolume] = useState('');
  const [meanVolume, setMeanVolume] = useState('');
  const [file, setFile] = useState('');
  const [normalizedFile, setNormalized] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [stdout, setStdout] = useState([""]);


  function getVideoFile() {
    clear()
    Videofile().then((v) => {
      setFile(v)
    })
  }

  function getVolume(filepath: string) {
    EventsOn("ffmpeg", ffmpeg)
    Volume(filepath).then((v) => {
      setMaxVolume(v.Max)
      setMeanVolume(v.Mean)
    }).finally(() => {
      EventsOff("ffmpeg")
    })
  }

  function clear() {
    setFile("")
    setMaxVolume("-")
    setMeanVolume("-")
    setIsLoading(false)
    setNormalized("")
    setStream("")
    setStdout([""])
  }

  function ffmpeg(data: Array<string>) {
    setStdout(data)
    // If there is a full set of data, drop the streamed data
    setStream("")
  }

  function handleStream(data: string) {
    setStream(data)
  }

  function normalize(filepath: string) {
    setIsLoading(true)
    EventsOn("ffmpeg", ffmpeg)
    EventsOn("stream", handleStream)
    Normalize(filepath)
      .then((result) => {
        setNormalized(result.Outfile)
        setMaxVolume(result.Max)
        setMeanVolume(result.Mean)
      })
      .finally(() => {
        EventsOff("ffmpeg")
        EventsOff("stream")
        setIsLoading(false)
      })
  }



  return (
    <Box height={"100vh"}>
      <Banner />
      <LinearProgress loading={isLoading} />

      <Box display="flex" justifyContent="center" width={"100vw"}>
        <Stack width={"70vw"}>
          <Stack direction={"row"} justify="space-between">
            <Button disabled={isLoading} bgColor={"brand.300"} width="140px" onClick={getVideoFile}>Select video file</Button>
            <Button disabled={isLoading || !file} width="140px" onClick={(_) => getVolume(file)}>Analyze</Button>
            <Button disabled={isLoading || !file} width="140px" onClick={(_) => normalize(file)}>Normalize Audio</Button>
            <Button disabled={isLoading} bgColor={"brand.300"} width="140px" onClick={clear}>Clear</Button>
          </Stack>
          {
            file
              ? <>
                <TextPair left="In:" right={file} />
                <TextPair left="Out:" right={normalizedFile} />
                <TextPair left="max volume:" right={maxVolume} />
                <TextPair left="mean volume:" right={meanVolume} />
                <Terminal loading={isLoading} stdout={stdout} stream={stream} />
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

const LinearProgress = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return <Progress height="5px" mt="5px" mb="5px" isIndeterminate color="brand.200" />
  } else {
    return <Divider height="5px" mt="5px" mb="5px" />
  }
}

interface ITerminal {
  loading: boolean
  stdout: string[]
  stream: string
}

const Terminal: React.FC<ITerminal> = ({ loading, stdout, stream }) => {
  const [openTerminal, setOpenTerminal] = useState(false);

  function showTerminal() {
    setOpenTerminal(!openTerminal)
  }

  return (
    <Box bg='brand.terminal' w='100%' p={4} rounded="md" >
      <Box display="flex">
        {
          stream
            ? <Text as="kbd" textColor="brand.white">{stream}</Text>
            : null
        }
        {
          stdout && !loading
            ? <Button width="100px" onClick={showTerminal}>{openTerminal ? "Hide" : "Show"}</Button>
            : null
        }
      </Box>
      <Collapse in={openTerminal} >
        <Stack>
          {
            stdout && !stream ? stdout.map(
              (element: string, index: number) => {
                return (
                  <Text fontSize="13px" key={index} as="kbd" textColor="brand.white">{element}</Text>
                )
              }
            )
              : null
          }
        </Stack>
      </Collapse>
    </Box>
  )
}

interface ITextPair {
  left: string
  right: string
}

const TextPair: React.FC<ITextPair> = ({ left, right }) => {
  return (
    <Stack direction={"row"} justify="space-between">
      <Text textColor={'brand.white'}>{left}</Text>
      <Text textColor={'brand.300'}>{right}</Text>
    </Stack>
  )
}
