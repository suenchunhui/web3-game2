import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import Router from 'next/router'


async function mint_a_word(){
    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? '';
    const web3auth = new Web3Auth({
      clientId: clientId,
      web3AuthNetwork: "cyan",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x1", //eth mainnet
        rpcTarget: "https://rpc.ankr.com/eth",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Ethereum Mainnet",
        blockExplorer: "https://etherscan.io",
        ticker: "ETH",
        tickerName: "Ethereum",
      },
    });
    await web3auth.initModal();
    const web3authProvider = web3auth.connect();
    //const provider = new ethers.providers.Web3Provider(web3authProvider); // web3auth.provider
    //TODO
    
    Router.push("/song");

}

export default function Mint(props) {
    return <div>
        <br/>
        <h1>Mint a Word</h1>
        <button onClick={ () => {mint_a_word().then();}}>Mint</button>
    </div>
}