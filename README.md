# Hook-ui-kit

### The `hook-ui-kit` library is a collection of useful hooks and components for building blockchain-based user interfaces on the WAX blockchain.

To install the `hook-ui-kit` library, run the following command:
```sh
npm install hook-ui-kit
```
The hook-ui-kit library currently supports two wallets: the Wax Cloud Wallet and Anchor. These are the two most popular wallets on the WAX blockchain. We will be adding support for more wallets in the near future.


## Usage
To use the `hook-ui-kit` library, you must first import the HookProvider component and wrap your application with it. This component will provide access to the Context object, which contains all the necessary functions and data for interacting with the blockchain.

```bash
import React from 'react';
import { HookProvider } from 'hook-ui-kit';

function App() {
  return (
    <HookProvider
    network={'mainnet'}
    colorMode={'dark'}
    >
      {/* Your application code */}
    </HookProvider>
  );
}
```

### Available Functions
The following functions are available in the Context object:

 - `showModal` - Opens a modal window for connecting a wallet.
 - `logout` - Logs out of the connected wallet.
 - `changeRpc` - Changes the RPC endpoint (mainnet or testnet).
 - `changeTheme` - Changes the UI theme (dark or light).
 - `pushTransaction` - Sends a transaction to the blockchain.



### Example

Here is an example of how to use the hook-ui-kit library to connect to a wallet and send a transaction:

```bash
import React, {useContext, useState} from 'react'
import {Context} from 'hook-ui-kit'


const App = () => {
    const { showModal,
        pushTransaction,
        wallet,
        changeTheme,
        logout,
        changeRPC } = useContext<any>(Context);
    const [isLoading, setIsLoading] = useState(false);

    const transact = async () => {
        setIsLoading(true)
        pushTransaction([{
            account: 'eosio.token',
            name: 'transfer',
            data: {
                from: wallet,
                to: 'eosio',
                quantity: '0.00000001 WAX',
                memo: '',
            }
        }]).then((resp:any) => console.log(resp)).catch((e:any) => console.log(e)).finally(() => setIsLoading(false))
    }
    return(
        <div>
            {!wallet ? 
            <>
                <button onClick={() => showModal()}>show modal</button>
                <button onClick={() => changeTheme('dark')}>changeTheme</button>
                <button onClick={() => changeRPC('testnet')}>testnet</button>
                <button onClick={() => changeRPC('mainnet')}>mainnet</button>
                
            </> 
            : 
            <>
                <p>{wallet}</p>
                <button onClick={() => logout()}>Logout</button>
                <button onClick={() => transact()}>Push</button>
                {isLoading && <span>Loading...</span>}
            </>
            }
            
        </div>
    )
}
export default App
```

Example: https://github.com/HookTools/hook-ui-kit-example
