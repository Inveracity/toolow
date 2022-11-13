import { Normalize, Videofile, Volume } from "../../../wailsjs/go/main/App"
import { EventsOff, EventsOn } from "../../../wailsjs/runtime/runtime"

export interface State {
  maxVolume: string
  meanVolume: string
  file: string
  normalizedFile: string
  isLoading: boolean
  stream: string
  stdout: string[]
}

export let initialState: State = {
  file: "",
  isLoading: false,
  maxVolume: "",
  meanVolume: "",
  normalizedFile: "",
  stdout: [""],
  stream: "",
}

export type ActionTypes = "normalize"
  | "analyze"
  | "load_file"
  | "clear"

export interface Action extends State {
  type: ActionTypes
}

function normalizeReducer(state: State, action: Action): State {
  switch (action.type) {
    case "load_file":
      return { ...action }
    case "normalize":
      return state
    case "analyze":
      return state
    case "clear":
      return { ...initialState, file: action.file }
    default:
      return state
  }
}

export default normalizeReducer;

function clear(): State {
  return initialState
}



function getVolume(filepath: string) {
  EventsOn("ffmpeg", ffmpeg)
  Volume(filepath).then((v) => {
    // setMaxVolume(v.Max)
    // setMeanVolume(v.Mean)
  }).finally(() => {
    EventsOff("ffmpeg")
  })
}

function ffmpeg(data: Array<string>) {
  // setStdout(data)
  // If there is a full set of data, drop the streamed data
  // setStream("")
}

function handleStream(data: string) {
  //setStream(data)
}

function normalize(filepath: string) {
  // setIsLoading(true)
  EventsOn("ffmpeg", ffmpeg)
  EventsOn("stream", handleStream)
  Normalize(filepath)
    .then((result) => {
      // setNormalized(result.Outfile)
      // setMaxVolume(result.Max)
      // setMeanVolume(result.Mean)
    })
    .finally(() => {
      EventsOff("ffmpeg")
      EventsOff("stream")
      // setIsLoading(false)
    })
}
