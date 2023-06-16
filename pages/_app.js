import '../styles/globals.css'
// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from "../components/NavBar";

// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'
import { Web3AuthProvider } from "../context/web3auth";

// 2. Extend the theme to include custom colors, fonts, etc
const config = {
    initialColorMode: 'dark', // 'dark' | 'light'
    useSystemColorMode: false,
}

export const theme = extendTheme({ config })

// 3. Pass the `theme` prop to the `ChakraProvider`
function MyApp({ Component, pageProps }) {
    return (
        <Web3AuthProvider chain={"testnet"} web3AuthNetwork={"testnet"}>
            <ChakraProvider theme={theme}>
                 <NavBar/>
                <Component {...pageProps} />
            </ChakraProvider>
        </Web3AuthProvider>

    )
}

export default MyApp