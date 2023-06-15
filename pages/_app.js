import '../styles/globals.css'
import "../styles/js-hero.css";

// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const config = {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false,
}

export const theme = extendTheme({ config })

// 3. Pass the `theme` prop to the `ChakraProvider`
function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    )
}

export default MyApp