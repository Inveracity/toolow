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
  | "stdout"
  | "loading"
  | "stream"

export interface Action extends State {
  type: ActionTypes
}

function normalizeReducer(state: State, action: Action): State {
  switch (action.type) {
    case "load_file":
      return { ...state, file: action.file }
    case "normalize":
      return { ...state, maxVolume: action.maxVolume, meanVolume: action.meanVolume }
    case "analyze":
      return { ...state, maxVolume: action.maxVolume, meanVolume: action.meanVolume, isLoading: false }
    case "clear":
      return { ...initialState }
    case "stdout":
      return { ...state, stdout: action.stdout, stream: "" }
    case "stream":
      return { ...state, stream: action.stream, stdout: [""], isLoading: action.isLoading }
    case "loading":
      return { ...state, isLoading: action.isLoading }
    default:
      return state
  }
}

export default normalizeReducer;
