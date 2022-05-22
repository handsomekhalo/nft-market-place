/* eslint-disable no-undef */
import React, {Component} from 'react';
import web3 from 'web3';
//detect eth provider
import detectEthereumProvider from "@metamask/detect-provider";
import KrytoBird from '../abis/KryptoBird.json';
import {MDBCard , MDBCardBody,MDBCardText,MDBCardTitle, MDBCardHeader,MDBBtn, MDBCardImage} from "mdb-react-ui-kit"
import './App.css'

class App extends Component{

//life cycle rendering

   async componentDidMount() {
       await this.loadweb3();
       await this.loadBlockChainData();

       //web3.eth.net.getid()

   }
   
//load web 3 in order fro library to detect metamask
//first set up etherium provider eth or any other
async loadweb3() {
    //pattern to load things up
    const provider = await detectEthereumProvider();

    //check morden broser to check etherium
    //if provider availbe then lets log its working and aceess window
    //to set web3 to provider

    if (provider) {
        console.log("Eth wallet connected");
        window.web3 = new web3(provider)
    } else {
        //no eth provider
        console.log("No Eth wallet detected")

    }
}

//fetch all accounts on your ganache
async loadBlockChainData()
{

    const web3 = window.web3
    const acc = await web3.eth.requestAccounts();
    //to dynamiccalyy add accoutns
    this.setState({account:acc[0]})
           //web3.eth.net.getid()
    const netWorkId = await web3.eth.net.getId();

    const netWorkData= KrytoBird.networks[netWorkId]
    //check if we are hooked up correctly
    if (netWorkData)
    {
        //abi to set to the krptobird abi
        const abi = KrytoBird.abi
        // address set to networkData address

    const address = netWorkData.address
        // contract which grabs new instance of a web3 eth contract
        const contract = new web3.eth.Contract(abi , address)
        //log console in the contract succesfully
        this.setState({contract})
      

        //call total suppl of kryptobirds
       // grab total aupply on front end and log resulyd
       const totalSupply = await contract.methods.totalSupply().call()
        this.setState({totalSupply})
        //array tokeep grack of tokens load krytobirds for us
      for (let i = 1; i <= totalSupply; i++) {
        //set each bird to the ones in the contract
       const  KryptoBird = await contract.methods
       .kryptoBirdz(i - 1).call();
//handle state on the front end, what to do with above info
        this.setState({
            kryptobirdz:[...this.state.kryptobirdz, KryptoBird]

        })

      }
         

    }
    else{
        window.alert('Smart contract not deployed')
    }

}


//to dynamiccalyy add accoutns
constructor(props)
{
    super(props);
   this.state ={
       account:'',
       contract:null,
       totalSupply:0,
       kryptobirdz:[]

   }
}

//with minting we are sending info we need to specify the acc
mint =(kryptoBird)=>
{
    this.state.contract.methods.mint(kryptoBird)
    .send({from:this.state.account}).once('receipt',(receipt)=>{
        
     this.setState({
                     // eslint-disable-next-line no-undef
                     kryptobirdz: [...this.state.kryptobirdz, KryptoBird]

     })

    })
}
    render() {
        return(
            <div className='container-filled'>
                        {
                            console.log(this.state.kryptobirdz)
                        }

            <nav className='navbar navbar-dark fixed-top bg-dark flex-
            ms-nowrap p-0 shadow'>
            <div div className = 'navbar-brand col-sm-3 col-md-3 mr-0'
            style = {{color: "white" }} >
                Krypto Birdz NFTs (Non fungible Tokens)
            </div>

        <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none
         d-sm-block">
         <small small className = 'text-white' >
         
             {this.state.account}
         </small>

        </li>
        </ul>
        </nav>

        <div className="container-fluid mt-1">
            <div className='row'>
                <main role='main' className="col-lg-12 d-flex text-center">
                    <div className="content mr-auto ml-aito"
                    style={{opacity:'0.8'}}>
                    <h1 style={{color:'black'}}>KryptoBirdz-NFT Marketpalce</h1>
                        <form onSubmit={()=>{
                            // eslint-disable-next-line no-restricted-globals
                            event.preventDefault();
                            const kryptoBird = this.kryptoBird.value
                            this.mint(kryptoBird)

                        }}>

                        <input style={{margin:'6px'}}type='text' className='form-control mb-1' 
                        placeholder='Add file Location'
                            ref={(input)=>this.kryptoBird = input}
                        />

                        <input className='btn btn-primary btn-black'
                        type="submit" value="MINT" />
                        </form>
                    </div>
                </main>
            </div>
            <hr></hr>
            <div className='row textCenter'>
            {
                this.state.kryptobirdz.map((kryptoBird, key)=>{
                    
                    return(
                        <div >
                            <MDBCard className='token img' style={{maxWidth:'22rem'}}>
                             <MDBCardImage src={kryptoBird} position='top' height='250rem'
                               style={{marginRight:'4px'}}/>

                                <MDBCardBody>
                                    {/*fin a way to show title/Text dynamically*/}
                                      <MDBCardTitle   MDBCardTitle>KryptoBirdz</MDBCardTitle>
                                 {/*use meta data to prpagate below*/}
                                    <MDBCardText>The krytpo are 20 uniqely kbirds from the handsome could dystopi,
                                     there is pny 1 of each and only 1 can be owned by  a single person on etherium blockchain
                                    </MDBCardText>
                                   <MDBBtn href={{kryptoBird}}>Download</MDBBtn>
                                </MDBCardBody>
                            </MDBCard>
                        </div>
                    )
                })}
            

            </div>
  
        </div>
    </div>
        )
    }
}

export default App;

