import { Box, Button, Collapse, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface ITerminal {
  loading: boolean
  stdout: string[]
  stream: string
}

const Terminal: React.FC<ITerminal> = ({ loading, stdout, stream }) => {
  const [openTerminal, setOpenTerminal] = React.useState(false);

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

export default Terminal;
