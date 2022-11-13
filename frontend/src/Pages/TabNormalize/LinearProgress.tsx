import { Divider, Progress } from "@chakra-ui/react"

const LinearProgress = ({ loading }: { loading: boolean }) => {
  if (loading) {
    return <Progress height="5px" mt="5px" mb="5px" isIndeterminate color="brand.200" />
  } else {
    return <Divider height="5px" mt="5px" mb="5px" />
  }
}

export default LinearProgress;
