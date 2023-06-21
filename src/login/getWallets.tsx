import React from 'react';

const GetWallet = () => {
    return(
        <div className='get-a-walelt-div'>
            <h2 style={{margin: 0}}>Get a wallet</h2>
            <div className='hook-get-wallets'>
                <div>
                <img src={"https://www.wax.io/static/baf62c0fbd55395b4a13addaaec1c303/5285a/WCW-Logo-Smaller.png"} alt=""/>
                <div>
                    <p>Cloud Wallet</p>
                    <p>Create a new wallet in a few clicks.</p>
                </div>
                </div>
                <a target="_blank" href="https://www.mycloudwallet.com/">GET</a>
            </div>
            <div className='hook-get-wallets'> 
                <div>
                <img src={"https://www.greymass.com/_app/immutable/assets/anchor-logo-58487e5c.svg"} alt=""/>
                <div>
                    <p>Anchor</p>
                    <p>Use the Anchor Wallet to seamlessly and securely interact with any EOSIO-based blockchain.</p>
                </div>
                </div>
                <a target="_blank" href="https://www.greymass.com/anchor">GET</a>
            </div>
        </div> 
    )
}

export default GetWallet;