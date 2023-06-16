import { ADAPTER_EVENTS, SafeEventEmitterProvider } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { getWalletProvider, } from "./walletProvider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { ethers } from "ethers";
import Web3 from "web3";

export const Web3AuthContext = createContext({
  web3Auth: null,
  provider: null,
  isLoading: false,
  user: null,
  chain: "",
  login: async () => { },
  logout: async () => { },
  getUserInfo: async () => { },
  signMessage: async () => { },
  getAccounts: async () => { },
  getBalance: async () => { },
  signTransaction: async () => { },
  signAndSendTransaction: async () => { },
  addChain: async () => { },
  switchChain: async () => { },
});

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}

export const Web3AuthProvider = ({ children, web3AuthNetwork, chain }) => {
  const [web3Auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [pureProvider, setpureProvider] = useState(null);
  const [user, setUser] = useState('Loading User.');
  const [isLoading, setIsLoading] = useState(false);
  const [_document, set_document] =useState(null)

  useEffect(() => {
    set_document(document)
  }, [])


  const setWalletProvider = useCallback(
    (web3authProvider) => {
      const walletProvider = getWalletProvider(chain, web3authProvider, uiConsole);
      setProvider(walletProvider);
    },
    [chain]
  );

  useEffect(() => {
    const subscribeAuthEvents =  (web3auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3auth.on(ADAPTER_EVENTS.CONNECTED, async (data) => {
        console.log("Yeah!, you are successfully logged in", data);
         setWalletProvider(web3auth.provider);
         let _web3 = new Web3(web3auth.provider);
         let _address = (await _web3.eth.getAccounts())[0];
         console.log(_address)
         setUser(_address)
      });

      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
        setUser(null);
      });

      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error("some error or user has cancelled login request", error);
      });
    };

    const currentChainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x5',
      rpcTarget: `https://goerli.infura.io/v3/a9bb5c9d68494b7bb8f6af177490d9fb`
      //'https://rpc.ankr.com/eth',
    };

    async function init() {
      try {

        setIsLoading(true);
        const web3AuthInstance = new Web3Auth({
          uiConfig: {
            appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
            theme: "dark",
            loginMethodsOrder: ["google"],
            defaultLanguage: "en",
          },
          chainConfig: currentChainConfig,
          // get your client id from https://dashboard.web3auth.io
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        });

        const adapter = new OpenloginAdapter({ adapterSettings: { network: web3AuthNetwork } });
        web3AuthInstance.configureAdapter(adapter);
        subscribeAuthEvents(web3AuthInstance);
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [chain, web3AuthNetwork, setWalletProvider]);

  const login = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    const localProvider = await web3Auth.connect();
    const _provider = new ethers.providers.Web3Provider(localProvider);
    setpureProvider(_provider);
    setWalletProvider(_provider);  


  };

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
  };

  const getUserInfo = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3Auth.getUserInfo();
    setUser(user)
    uiConsole(user);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    //  await provider.getAccounts()
    return (await provider.getAccounts());
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    return (await provider.getBalance());
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await provider.signMessage();
  };

  const signTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await provider.signTransaction();
  };

  const getSigner = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    //  const ethersProvider = new ethers.providers.Web3Provider(provider);
    const finalProvider = provider.getSigner();
    await finalProvider();
  };




  const signAndSendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    await provider.signAndSendTransaction();
  };

  const createContract = async (_abi, _address) => {
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    return (provider.createContract(_abi, _address,user));
  };

  const uiConsole = (...args) => {
    console.log(args)
    //const el = _document.querySelector("#console>p");
  //  if (el) {
  //    el.innerHTML = JSON.stringify(args || {}, null, 2);
  //  }
  };

  const contextProvider = {
    web3Auth,
    chain,
    provider,
    user,
    isLoading,
    pureProvider,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    getSigner,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    createContract
  };
  return <Web3AuthContext.Provider value={contextProvider}>{children}</Web3AuthContext.Provider>;
};
