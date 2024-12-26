import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"

export function Provider(props) {
  return (
    <ChakraProvider value={props.value}>
      <ThemeProvider>
        {props.children}
      </ThemeProvider>
    </ChakraProvider>
  )
} 