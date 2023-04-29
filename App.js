import { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import Web3 from 'web3';




function App() {
  const [data, setData] = useState([]);
  const [inputAddress, setInputAddress] = useState('');
  const web3 = new Web3(window.ethereum);
  //const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
  const apiKey = "put your api key";


  useEffect(() => {
    const isValidAddress = web3.utils.isAddress(inputAddress);
    if (!isValidAddress) {
      return;
    }
    const fetchData = async () => {
      const result = await axios(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${encodeURIComponent(inputAddress)}&startblock=0&endblock=99999999&page=1&sort=desc&apikey=${apiKey}`
      );
      setData(result.data.result);
    };
    
    fetchData();
  }, [inputAddress]);
  

  const getTransactionLink = (txHash) => {
    return `https://etherscan.io/tx/${txHash}`;
  };

  const getSenderLink = (senderAddr) => {
    return `https://etherscan.io/address/${senderAddr}`;
  }

  const getHumanTimestamp = (timeStamp) => {
    var newDateFormat = new Date(timeStamp * 1000); 
    return newDateFormat.toDateString();

  }

  const getHumanReadibleMessage = (hexString) => {
    try {
      return decodeURIComponent(escape(Buffer.from(hexString, 'hex').toString('utf8')));
    } catch (error) {
      console.log(error);
      return "Error: Unable to decode input data";
    }
  };
  
  
  return (
    <div className="p-8">
      <h2 className="text-3xl text-center font-bold mb-8">Easily fetch message history from an ethereum address</h2>
      <div className="mb-8">
        <label htmlFor="address" className="block mb-2">
          Enter an ethereum address:
        </label>
        <input
          type="text"
          id="address"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          className="border border-gray-400 py-2 px-4 rounded w-full"
        />
      </div>
      <ul>
        {Array.isArray(data) && data.length > 0 ? (
          data
            .filter((tx) => tx.input !== '0x' && !getHumanReadibleMessage(tx.input.slice(2)).startsWith('Error'))
            .map((tx) => (
              <li key={tx.hash} className="mb-8">
                <div className="bg-white border border-gray-400 p-4 rounded">
                <p className="font-bold mb-2">Timestamp:</p>
                <p>{ getHumanTimestamp(tx.timeStamp)}</p>
                  <p className="font-bold mb-2">Transaction:</p>
                  <a href={getTransactionLink(tx.hash)} target="_blank" rel="noreferrer">
                    {tx.hash}
                  </a>
                  <p className="font-bold mb-2">From:</p>
                  <a href={getSenderLink(tx.from)} target="_blank" rel="noreferrer">
                  {tx.from}
                  </a>

                  <p className="font-bold mb-2">ENS</p>
                  <p>{tx.from}</p>
  
                  <p className="font-bold mb-2">Message:</p>
                  <p>{getHumanReadibleMessage(tx.input.slice(2))}</p>
                </div>
              </li>
            ))
        ) : (
          <p>No transactions found.</p>
        )}
      </ul>
      <footer
  class="bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
  <div class="p-4 text-center text-neutral-700 dark:text-neutral-200">
    Quickly built by
    <a class="text-neutral-800 dark:text-neutral-400" href="https://twitter.com/StringerSoze"> StringerSoze</a> | Designed based on<a class="text-neutral-800 dark:text-neutral-400" href="https://twitter.com/stonecoldpat0/status/1638254398072582151"> Patrick McCorry's tweet</a>
  </div>
</footer>

    </div>
  );
}

export default App;