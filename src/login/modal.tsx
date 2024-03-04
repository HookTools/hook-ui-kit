import React, {useState, useContext} from "react"
import { Context } from "./context"
import { QRCode } from "react-qrcode-logo"
import GetWallet from "./getWallets"

const Modal = () => { 
    const context:any = useContext(Context)
    const [choose, setChoose] = useState('main')
    const [loginLink, setLoginLink] = useState('')
    const [loader,setLoader] = useState(true)
    const link = context.link;
    return(
      <>
      <div>
            <div style={!context.modal ? {top: '200%'} : {}}  className='login-div'>
              <button className='close-login-div' onClick={context.closeModal}>
                <p></p>
                <p></p>
              </button>
              <div className={ choose === 'main' ? 'choose-wallets-hook' : 'choose-wallets-hook-main choose-wallets-hook' }>
                <h2 className='choose-wallet-h2'>Connect a Wallet</h2>
                <h3 className='choose-wallet-h3'>Popular</h3>


                {
                    context.network === "mainnet" ? 
                        <button className='login-btn' onClick={async () => {
                            setChoose('wcw')
                            setLoader(true)
                            await context.wax.login().then((data:string) => {
                                localStorage.setItem('login', '1')
                                context.closeModal()
                                context.login(data,'wcw')
                                
                            }).finally(() => setLoader(false));
                            }}>
                                <img src={'https://www.wax.io/static/baf62c0fbd55395b4a13addaaec1c303/5285a/WCW-Logo-Smaller.png'} alt=""/>
                                Cloud Wallet
                        </button> 
                    : 
                    ''
                }


                <button onClick={ async () => {
                  setTimeout(() => {
                    let doc:any = (document.getElementsByClassName('anchor-link-button'))
                    setLoginLink(doc[0].href)
                  },1000)
                  setChoose('anchor')
                  const identity = await link.login('mydapp')
                  context.closeModal()
                  localStorage.setItem('login', '0')
                  context.login(String(identity.session.auth.actor),'anchor')
                }} className='login-btn'><img src={'https://www.greymass.com/_app/immutable/assets/anchor-logo-58487e5c.svg'} alt="" /> Anchor</button>
                <div className='dont-have-wallet'>
                  <p>Don't have a wallet?</p>
                  <button>GET</button>
                </div>
              </div>
              <div className={ choose !== 'main' ? 'connect-info-hook' : 'connect-info-hook-main connect-info-hook' }>
                <button style={choose === 'main' ? {display: 'none'} : {}} onClick={() => setChoose('main')}>
                  <svg className="hook-left-arrow" viewBox="0 0 60 100"><path d="M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z"></path></svg>
                </button>
                {choose === 'main' ? 
                <div className='what-wallet'>
                  <h2>What is wallet?</h2>
                  <div>
                    <h3>A Home for your Digital Assets</h3>
                    <p>Wallets are used to send, receive, store, and display digital assets and NFTs.</p>
                  </div>
                  <div>
                    <h3>A New Way to Log In</h3>
                    <p>Instead of creating new accounts and passwords on every website, just connect your wallet.</p>
                  </div>
                  <button onClick={() => setChoose('getwallet')}>Get a wallet</button>
                </div>
                :
                choose === 'anchor' ?
                <div className='anchor_qr'>
      
                  {loginLink !== '' ? 
                  <div style={context.colorMode === 'dark' ? {background: "#FFF"} : {background: '#1a1b1f'}} className="qr-code-anchor-login">
                        {/* <QRCode 
                            removeQrCodeBehindLogo
                            logoPaddingStyle={'circle'}
                            qrStyle={'dots'}
                            fgColor={context.colorMode !== 'dark' ? '#FFF' : 'black'}
                            ecLevel={'Q'}
                            logoWidth={70}
                            quietZone={5}
                            logoImage={'https://www.greymass.com/_app/immutable/assets/anchor-logo-58487e5c.svg'}
                            size={250}
                            bgColor={context.colorMode !== "dark" ? '#1a1b1f' : '#FFF'}
                            value={loginLink}
                            eyeRadius={[
                            [10, 10, 0, 10], // top/left eye
                            [10, 10, 10, 0], // top/right eye
                            [10, 0, 10, 10], // bottom/left
                            ]}
                            eyeColor={[
                            "#3650a2","#3650a2","#3650a2"
                            ]}
                            
                        /> */}
                  </div>
                    : 
                    <div className='qr_loader'></div>
                    }
                    <p>Scan the QR-code with Anchor on another device or use the button to open it here.</p>
                 <button onClick={() => window.location.href=loginLink } className='retry'>Launch Anchor</button>
                </div> 
                :
                choose === 'wcw' ? 
                  <div className='wcw_div'>
                      <img width={30} src={'https://www.wax.io/static/baf62c0fbd55395b4a13addaaec1c303/5285a/WCW-Logo-Smaller.png'} alt=""/>
                      <h3>Openning Wax Cloud Wallet...</h3>
                      <p>Confirm connection in the extension</p>
                      { loader ?
                        <svg width={100} version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
                          <path fill={context.colorMode === 'dark' ? '#FFF' : 'gray'} d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                            <animateTransform 
                              attributeName="transform" 
                              attributeType="XML" 
                              type="rotate"
                              dur="1s" 
                              from="0 50 50"
                              to="360 50 50" 
                              repeatCount="indefinite" />
                        </path>
                        </svg>
                        :
                        <button 
                          className='retry'
                          onClick={async () => {
                          setChoose('wcw')
                          setLoader(true)
                          await context.wax.login().then(() => {
                            localStorage.setItem('login', '1')
                            context.closeModal()
                            
                          }).catch(() => setLoader(false)); }}
                          >Retry</button>
                      }
                  </div>
                : 
                choose === 'getwallet' ? 
                <GetWallet />
                : ''}
              </div>
            </div> 
      </div>
      </>
    )
  }

export default Modal;