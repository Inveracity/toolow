import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ChakraProvider, StyleFunctionProps } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const colors = {
  brand: {
    bg: "#303030",
    white: "#fbf5f4",
    terminal: "#181a1f",
    200: "#f5c5b6",
    300: "#ef9578",
    400: "#ea653a",
  },
}


const theme = extendTheme(
  {
    colors,
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          color: 'default',
          bg: 'brand.bg',
          overflowX: 'hidden',
        },
      })
    }
  }
)

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
)
