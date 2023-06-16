import { Web3Auth } from '@web3auth/modal';
import * as React from 'react';
import { WalletConnectV1Adapter } from '@web3auth/wallet-connect-v1-adapter';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import RPC from '../utils/web3RPC';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? '';

const init = async () => {
  try {
    const web3auth = new Web3Auth({
      uiConfig: {
        appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
        theme: "dark",
        loginMethodsOrder: ["google"],
        defaultLanguage: "en",
      },
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x1',
        rpcTarget: 'https://rpc.ankr.com/eth',
      },
      web3AuthNetwork: 'testnet',
    });

    const walletConnectV1Adapter = new WalletConnectV1Adapter({
      adapterSettings: {
        bridge: 'https://bridge.walletconnect.org',
      },
      clientId,
    });

    web3auth.configureAdapter(walletConnectV1Adapter);
    const metamaskAdapter = new MetamaskAdapter({
      clientId,
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x1',
        rpcTarget: 'https://rpc.ankr.com/eth',
      },
    });

    metamaskAdapter.setAdapterSettings({
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: '0x5',
        rpcTarget: 'https://rpc.ankr.com/eth_goerli',
      },
      web3AuthNetwork: 'testnet',
    });
    web3auth.configureAdapter(metamaskAdapter);
    await web3auth.initModal();
    return web3auth;
  } catch (error) {
    throw error;
  }
};

export default function Authentication(props) {
  const [isLoading, setLoading] = React.useState(true);
  const [userAddress, setUserAddress] = React.useState(null);

  const [auth, setAuth] = React.useState(props.isAuth);
  const [web3auth, setWeb3auth] = React.useState();
  React.useEffect(() => {
    async function wrap() {
      const initWeb3 = await init();
      setWeb3auth(initWeb3);
      setLoading(false);
    }
    wrap();
  }, []);

  const login = React.useCallback(async () => {
    if (!web3auth) {
      return;
    }
    const web3authProvider =
      await web3auth.connect();
    if (web3authProvider != null) {
      const rpc = new RPC(web3authProvider);
      const address = await rpc.getAccounts();
      setUserAddress(address)
      const userInfo = await web3auth.getUserInfo();
      const latestUserData = {
        email: userInfo.email ?? '',
        wallet: address,
        name: userInfo.name ?? '',
      };

      const holding = await rpc.getNFT()
      if (holding === true) {
        setAuth(true);
      } else {
        setAuth(true);
      }

    }
  }, [web3auth]);

  const logout = React.useCallback(async () => {
    if (web3auth) {
      await web3auth.logout();
    }
    setAuth(false);
  }, [web3auth]);

  return (
    <div style={{
      paddingTop: '20px'
    }}>
      {isLoading === true ? (<>
        </> ) : (
        <>
          {auth ? (
            <div dir="rtl">
              <button dir="rtl" className="rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={logout} disabled={isLoading} variant="outlined">
                logout
              </button>
              <button disabled={isLoading} className="rounded-full inline-flex items-center h-10 px-5 text-green-100 transition-colors duration-150 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-800">
                <span>{userAddress} </span>
                <svg className="w-4 h-4 ml-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
              </button>

            </div>
          ) : (
            <div dir="rtl">
              <button className="rounded-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={login} disabled={isLoading} variant="outlined">
                login
              </button>
            </div>

          )}
        </>
      )}
    </div>
  );
}
