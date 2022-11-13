import { Stack, Text } from "@chakra-ui/react";

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

export default TextPair;
