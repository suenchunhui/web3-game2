import { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";
import { IWalletProvider } from "./walletProvider";
import { ethers } from "ethers";
import { useRouter } from 'next/router'

const ethProvider = (provider, uiConsole) => {
  //const ethersProvider = new ethers.providers.Web3Provider(provider);
  //const finalProvider = ethersProvider.getSigner();


  const getSigner = async () => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const finalProvider = ethersProvider.getSigner();
      /*
      const web3 = new Web3(provider);
      const Signers = await ethers.getSigners();
      const deployerAddress = Signers[0].address;
      const realSigner = await ethers.getSigner(Signers[0].address);
      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];
*/
      return finalProvider;
    } catch (error) {
      console.error("Error", error);
      uiConsole("error", error);
    }
  };

  const getAccounts = async () => {
    try {
      console.log(provider)
      if (!provider) {
        return;
      }
      const web3 = new Web3(provider);
      // Get user's Ethereum public address
       if (typeof web3.eth.getAccounts !== "undefined") {
       //safe to use the function
        return 'Loading..'
       } else {
      const address = (await web3.eth.getAccounts())[0];
      console.log(await web3.eth.getAccounts())
      return address;
        }
    } catch (error) {
      console.error("Error", error);
      uiConsole("error", error);
    }
  };
  const createContract = async (_abi, _address,_userAddress) => {
    try {
      if (!provider) {

      } else {
        const web3 = new Web3(provider);
        // Get user's Ethereum public address
        var contract = new web3.eth.Contract(_abi, _address,_userAddress);
        return contract;
      }

    } catch (error) {
      console.error("Error", error);
      uiConsole("error", error);
    }
  };

  const getChainId = async () => {
    try {
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      // Get the connected Chain's ID
      const networkDetails = await ethersProvider.getNetwork();

      return networkDetails.chainId;
    } catch (error) {
      return error;
    }
  }

  const getBalance = async () => {
    try {
      const web3 = new Web3(provider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];
      let balance = await web3.eth.getBalance(address)
      return balance;
    } catch (error) {
      console.error("Error", error);
      uiConsole("error", error);
    }
  };

  const signMessage = async () => {
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(originalMessage);

    return signedMessage;
  };

  const signAndSendTransaction = async () => {
    try {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();

      const txRes = await web3.eth.sendTransaction({
        from: accounts[0],
        to: accounts[0],
        value: web3.utils.toWei("0.01"),
      });
      uiConsole("txRes", txRes);
    } catch (error) {
      console.log("error", error);
      uiConsole("error", error);
    }
  };

  const signTransaction = async () => {
    try {
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      console.log("pubKey", accounts);
      // only supported with social logins (openlogin adapter)
      const txRes = await web3.eth.signTransaction({
        from: accounts[0],
        gas: 21000,
        to: accounts[0],
        value: web3.utils.toWei("0.01"),
      });
      uiConsole("txRes", txRes);
    } catch (error) {
      console.log("error", error);
      uiConsole("error", error);
    }
  };
  return { getAccounts, getBalance, signMessage, signAndSendTransaction, signTransaction, getSigner, createContract };
};

export default ethProvider;
