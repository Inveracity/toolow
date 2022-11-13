import { Box, Button, Stack } from "@chakra-ui/react"
import React from "react"
import { Videofile } from "../../../wailsjs/go/main/App"
import LinearProgress from "./LinearProgress"
import normalizeReducer, { initialState } from "./normalizeReducer"
import Terminal from "./Terminal"
import TextPair from "./TextPair"



const Normalize = () => {
  const [state, dispatch] = React.useReducer(normalizeReducer, initialState)

  const getVideoFile = () => {
    Videofile().then((filepath) => {
      dispatch({ ...state, type: "load_file", file: filepath })
    })
  }

  return (
    <Box display="flex" justifyContent="center" width={"100vw"}>
      <Stack width={"70vw"}>
        <Stack direction={"row"} justify="space-between">
          <Button disabled={state.isLoading} bgColor={"brand.300"} width="140px" onClick={getVideoFile}>Select video file</Button>
          <Button disabled={state.isLoading || !state.file} width="140px" onClick={(_) => dispatch({ ...state, type: "analyze" })}>Analyze</Button>
          <Button disabled={state.isLoading || !state.file} width="140px" onClick={(_) => dispatch({ ...state, type: "normalize" })}>Normalize Audio</Button>
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

export default Normalize
