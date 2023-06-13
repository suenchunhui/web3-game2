import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import NftBox from "../src/NftBox";

async function mint_a_song(){
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
    const provider = new ethers.providers.Web3Provider(web3authProvider); // web3auth.provider
    //TODO
}

export default function Mint(props) {
  const nfts = [
    {
      name: "love",
      img: ""
    },
    {
      name: "slow",
      img: ""
    }
  ];

  return <div>
      <br/>
      {nfts.map(function(x, i){
        return <NftBox name={x.name} img={x.img} key={i} />;
      })}
      <br/>
      <button onClick={ () => {mint_a_song().then();}}>Mint a Song</button>
  </div>
}
