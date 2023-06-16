var axios = require('axios');
  
 //  DOCS : https://docs.nftport.xyz/docs/nftport/b3A6MjE0MDYzNzM-retrieve-nf-ts-owned-by-an-account

var config = {
  method: 'get', 
  url: 'https://api.nftport.xyz/v0/accounts/0x6474069dd3a54f5A983ADc2376A33352E528663A?chain=goerli',
  headers: { 
    'Authorization': 'a6387bb6-1eb8-492b-b441-5619b501e971' // API KEY.
  },
 };

axios(config)
.then(function (response) {
    if( response.data.response == "OK") {
        // Data is good.
      //  jsonReturn = JSON.stringify(response.data);
        console.log(response.data.nfts)
    } else {
        console.log( 'Error with API')
    }
   // 
 })
.catch(function (error) {
  console.log(error);
});

// node test/nftport.js