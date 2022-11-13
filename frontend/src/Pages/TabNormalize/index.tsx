import React from "react"
import { Box, Button, Stack } from "@chakra-ui/react"
import { Videofile, Volume, Normalize } from "../../../wailsjs/go/main/App"
import { EventsOff, EventsOn } from "../../../wailsjs/runtime/runtime"
import LinearProgress from "./LinearProgress"
import normalizeReducer, { initialState } from "./normalizeReducer"
import Terminal from "./Terminal"
import TextPair from "./TextPair"



const NormalizeTab = () => {
  const [state, dispatch] = React.useReducer(normalizeReducer, initialState)

  const getVideoFile = () => {
    Videofile().then((filepath) => {
      dispatch({ ...state, type: "load_file", file: filepath })
    })
  }

  const ffmpeg = (data: Array<string>) => {
    dispatch({ ...state, type: "stdout", stdout: data })
  }

  const getVolume = (filepath: string) => {
    EventsOn("ffmpeg", ffmpeg)
    Volume(filepath).then((v) => {
      dispatch({
        ...state,
        type: "analyze",
        maxVolume: v.Max,
        meanVolume: v.Mean,
        isLoading: true
      })
    }).finally(() => {
      EventsOff("ffmpeg")
      dispatch({ ...state, type: "loading", isLoading: false })
    })
  }

  const normalize = (filepath: string) => {
    dispatch({ ...state, type: "loading", isLoading: true })
    EventsOn("ffmpeg", ffmpeg)
    EventsOn("stream", handleStream)
    Normalize(filepath)
      .then((result) => {
        dispatch({
          ...state,
          type: "normalize",
          maxVolume: result.Max,
          meanVolume: result.Mean,
          normalizedFile: result.Outfile,
          isLoading: false,
        })
      })
      .finally(() => {
        dispatch({ ...state, type: "loading", isLoading: false })
        EventsOff("ffmpeg")
        EventsOff("stream")
      })
  }

  function handleStream(data: string) {
    dispatch({ ...state, type: "stream", stream: data, isLoading: true })
  }

  return (
    <Box display="flex" justifyContent="center" width={"100vw"}>
      <Stack width={"70vw"}>
        <Stack direction={"row"} justify="space-between">
          <Button disabled={state.isLoading} bgColor={"brand.300"} width="140px" onClick={getVideoFile}>Select video file</Button>
          <Button disabled={state.isLoading || !state.file} width="140px" onClick={() => getVolume(state.file)}>Analyze</Button>
          <Button disabled={state.isLoading || !state.file} width="140px" onClick={() => normalize(state.file)}>Normalize Audio</Button>
          <Button disabled={state.isLoading} bgColor={"brand.300"} width="140px" onClick={() => dispatch({ ...state, type: "clear" })}>Clear</Button>
        </Stack>
        {
          state.file
            ? <>
              <TextPair left="In:" right={state.file} />
              <TextPair left="Out:" right={state.normalizedFile} />
              <TextPair left="max volume:" right={state.maxVolume} />
              <TextPair left="mean volume:" right={state.meanVolume} />
              <Terminal loading={state.isLoading} stdout={state.stdout} stream={state.stream} />
            </>
            : null
        }
        <LinearProgress loading={state.isLoading} />
      </Stack>
    </Box>
  )
}

export default NormalizeTab
