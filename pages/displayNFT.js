import React, { useEffect, useState } from 'react';
import ImageGrid from "../components/ImageGrid";
 

export default function DisplayNFT(props) {

    return (
        <div className="App">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-4"> ERC-1155 NFT Collection</h1>
                   <ImageGrid></ImageGrid>
             </div>
        </div>
    );
}
