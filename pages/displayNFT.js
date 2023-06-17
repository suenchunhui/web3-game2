import React, { useEffect, useState } from 'react';
import ImageGrid from "../components/ImageGrid";


export default function DisplayNFT(props) {

    return (
        <div className="App">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-4"> ERC-1155 NFT Collection</h1>
                <a href={`https://testnets.opensea.io/assets/goerli/0x839bd54c01aa1332420f594e9847551b3b3bf643/`} target={"_blank"}><u>View on OpenSea</u></a>
                <br></br><br></br>

                <ImageGrid></ImageGrid>
            </div>
        </div>
    );
}
