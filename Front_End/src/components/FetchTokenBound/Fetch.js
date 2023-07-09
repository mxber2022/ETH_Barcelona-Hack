import "./Fetch.css";
import { ethers } from 'ethers';
import { abi } from './abi';
import { create } from 'ipfs-http-client';
import { useEffect, useState } from "react";
import logo from './logo.jpg'

function Fetch () {
    //const providesr = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");


    const [addi, setPublickey] = useState();
    const [network, setNetwork] = useState();
    const [chainId, setChainId] = useState();
    const [msg, setMsg] = useState();
    const [myArray, updateMyArray] = useState([]);
    const [buttonText, setButtonText] = useState('Connect Wallet');
    let provider;
    let signer;


    

    const contractAddress = "0x0ee7F43c91Ca54DEEFb58B261A454B9E8b4FEe8B";


    const [fileUrl, updateFileUrl] = useState('');


    const projectId = '2SHg9nYGwUEpcXJuBTdkDcT2tYV';
    const projectSecret = '6834cfa182ec09eeff6577aca368802e';
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth,
    }
    });



    async function onChange(e) {
        const file = e.target.files[0];
        let url;
        try {
            const added = await client.add(file)
            url = `https://scrollbarcelona.infura-ipfs.io/ipfs/${added.path}`
            updateFileUrl(url)
        } 
        catch (error) {
            console.log('Error uploading file: ', error)
        } 
        //console.log("URL", fileUrl);
        mint(url); 
    }



    async function mint(url) {
        console.log("URL IS: ", url)
        
        console.log(provider);
        signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract( contractAddress , abi , signer );
        await contract.safeMint(addi, String(url));
    }

    async function tUri(){
        
    }


    async function connectButton() {
      
            const { ethereum } = window;
            provider = new ethers.providers.Web3Provider(ethereum);
            if (ethereum.isMetaMask) {
              const accounts = await provider.send("eth_requestAccounts", [])
              const { name, chainId } = await provider.getNetwork();
              setNetwork(name);
              setChainId(chainId);
              setPublickey(accounts[0]);
              setButtonText("Connected");
            } else {
              setMsg("Install MetaMask");
            }
            console.log(chainId);
    }

    async function photogallery () 
    {
        updateMyArray([]);
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract( contractAddress , abi , provider );
        console.log("tokenURI", await contract.tokenURI(4));

        for(let i=0; i<10; i++){
           let x = await contract.tokenURI(i);
           if(x!==""){
            updateMyArray( arr => [...arr, x]);
           }
            
        }
        console.log(myArray);
    }


    return(
        <>
        <div className="mybuttons">
           
            <h2 className="nam"> ETH Barcelona Memories </h2>
        </div>
            
            <div className="mybuttons">
                <button className="btn" onClick={connectButton}>{buttonText}</button>
                <button className="btn" onClick={photogallery}>NFT Minted</button>
            </div>



            <h2 className="h2center">{addi}</h2>
            <button className="mintbutton" onClick={mint}>Mint</button>


            {addi==null? <h2 className="h2center">
            Connect wallet and Mint NFT on scroll
            </h2>
            :
            <>
                
                <div className="App">
                <h2 className="h2cen">Upload the NFT on IPFS to mint</h2>
      
                <input className="fileup"
                    type="file"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                    <img src={fileUrl} width="600px" /> 
                    )
                }
                <p>{fileUrl}</p>
                </div>
            </>
            }

            
            


            <div className='nfts_container'>
            { 
                myArray.map((temp) => {
                    return  <div className='sold' key={`${temp}`} >
                        
                        <img className="minted" src={`${temp}`} width="250px" height="250px" alt={`${temp}`} /> 
                </div>    
            }) 
            }
        </div>

        </>
    );
}

export default Fetch;