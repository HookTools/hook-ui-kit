import React,{ useEffect, useState} from 'react';
import AnchorLink from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import * as waxjs from "@waxio/waxjs/dist";
import { Context } from './context';
import Modal from './modal';
import './theme.css'
import './index.scss'

interface HookProvider{
  children: any,
  network: 'mainnet' | 'testnet',
  colorMode?: 'dark' | 'light',
  api?: string
}

interface Data{
  account: string,
  name:string,
  data: any[]
}
const HookProvider = ({children,network,colorMode = 'light',api}:HookProvider) => {
  const [rpc,setRpc] = useState(!localStorage.getItem('rpc') ? network : localStorage.getItem('rpc'));
  const [theme, setTheme] = useState(colorMode)
  useEffect(() => {
    document.body.style.setProperty('--fontColor',`var(--fontColor-${theme})`)
    document.body.style.setProperty('--secondFontColor',`var(--secondFontColor-${theme})`)
    document.body.style.setProperty('--background',`var(--background-${theme})`)
    document.body.style.setProperty('--walletBtn',`var(--walletBtn-${theme})`)
    document.body.style.setProperty('--line',`var(--line-${theme})`)
  },[theme])

  const changeTheme = (theme:'dark' | 'light') => {
    setTheme(theme)
  }
  const [wallet, setWallet] = useState<boolean | string>(false)
  useEffect(() => {
    document.body.style.setProperty('--login', `var(--login-${wallet ? 'true' : 'false'})`)
  },[wallet])
  const [modal, setModal] = useState<boolean>(false)
  const [method, setMethod] = useState<boolean | string>(false)
  const [_api, setApi] = useState(api);
  const changeApi = (api:string) => {
    setApi(api)
  }
  const [wax, setWax] = useState(new waxjs.WaxJS({
    rpcEndpoint: 'https://wax.greymass.com',
    tryAutoLogin: ( localStorage.getItem('login') === '1' ? true : false )
  }))
  const transport = new AnchorLinkBrowserTransport()
  const [link,setLink] = useState(new AnchorLink({
      transport,
      chains: [
        rpc === 'mainnet' ?
            {
                chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
                nodeUrl: 'https://wax.greymass.com',
            } 
          :
            {
                chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
                nodeUrl: 'https://waxtestnet.greymass.com'
            }
      ],
    }) 
  )
  const showModal = () => {
    setModal(true)
  }
  const closeModal = () => {
    setModal(false)
  } 

  const pushTransaction = async (data:Data[]) => {
    if ( method === 'wcw') {
      const actions:any[] = []
      data.forEach(element => 
        actions.push({
          account: element.account,
          name: element.name,
          authorization: [{
            actor: wax.userAccount,
            permission: 'active',
          }],
          data: element.data,
        })
      )
      const result = await wax.api.transact({
        actions: actions
      }, {
        blocksBehind: 3,
        expireSeconds: 1200,
      });
      return result;

    } else {
      await link.restoreSession('mydapp').then(async (session:any) => {
        const actions:any[] = []
        data.forEach(element => 
          actions.push({
            account: element.account,
            name: element.name, 
            authorization: [session.auth],
            data: element.data,
          })
        )        

        const result = await session.transact({actions})
        return result
    })
    }


  }
  const logout = () => {
    localStorage.setItem('login', '0')
    setWax(new waxjs.WaxJS({
      rpcEndpoint: 'https://wax.greymass.com',
      tryAutoLogin: false
    }))
    try{
      link.restoreSession('mydapp').then((session:any) => {
        if (session) {
          session.remove()
        }
      })
    } catch{

    }
    setWallet(false)
  }
  const login = (account:string, wallet:string) => {
    setWallet(account);
    setMethod(wallet);
  }
  async function autoLogin() { 
    try{
      link.restoreSession('mydapp').then((session:any) => {
        if (session) {
          localStorage.setItem('login', '0')
          login(String(session.auth.actor),'anchor')
        }
      })
    } catch{
      
    }
    if (localStorage.getItem('login') === '0' || rpc === 'testnet') {
      return
    }
    const isAutoLoginAvailable = await wax.isAutoLoginAvailable(); 
    if (isAutoLoginAvailable) { 
      await wax.login().then((data:string) => {
        localStorage.setItem('login', '1')
        login(data,'wcw')
      })
    }
  }
  useEffect(() => {
    autoLogin()
  },[])
  const changeRPC = (rpc: 'mainnet' | 'testnet') =>{
    localStorage.setItem('rpc', rpc)
    logout()
    setRpc(rpc)
    setLink(new AnchorLink({
      transport,
      chains: [
        rpc === 'mainnet' ?
            {
                chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
                nodeUrl: 'https://wax.greymass.com',
            } 
          :
            {
              chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
              nodeUrl: 'https://waxtestnet.greymass.com'
            }
      ],
    }))
  } 
  return (
    <Context.Provider value={
      { wallet,
        showModal,
        closeModal,
        modal,
        pushTransaction,
        wax,
        logout,
        login,
        link,
        network: rpc,
        api: _api,
        changeApi,
        colorMode: theme,
        changeRPC,
        changeTheme
        }
    }>
      <>
        <Modal />
        {children}
      </>
    </Context.Provider>
  );
}


export default HookProvider;
