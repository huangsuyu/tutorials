//initialize web3 and connect metamask
var web3, currentAccount, theContract;
$('#loader').hide();

window.addEventListener('DOMContentLoaded', function() {
  setTimeout(()=>{
    if (window.BinanceChain) {
      window.web3 = new Web3(window.BinanceChain);
      window.BinanceChain.enable();



      BinanceChain.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          // Some unexpected error.
          // For backwards compatibility reasons, if no accounts are available,
          // eth_accounts will return an empty array.
          console.error(err);
        });

      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      BinanceChain.on('accountsChanged', handleAccountsChanged);

      // For now, 'eth_accounts' will continue to always return an array
      function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
          // Binance Chain Wallet is locked or the user has not connected any accounts
          console.log('Please connect to Binance Chain Wallet.');
        } else if (accounts[0] !== currentAccount) {
          currentAccount = accounts[0];
          // Do any other work!
        }
      }


    //..account = web3.currentProvider.selectedAddress;
      console.log("connected with: "+currentAccount);
      theContract = new web3.eth.Contract(theContractABI,'0x95d480d7d50fc34f53db74d0d5585fc84c1ac284');
      getMessage();
    }
    else {
      console.log('Error: web3 provider not found... Make sure metamask or the wallet is configured properly.');
      $('#result').html('<p>Error: web3 provider not found... Make sure metamask or the wallet is configured properly.</p>');
    }
  }, 1000)
});



//write to BSC and do something with event
function writeMessage(){
  var input = $('#messageInput').val();
  theContract.methods.writeMessage(input)
  .send({ from: currentAccount, gas: 3000000, gasPrice: 30*1000000000, value:100000000000000000 }, function(error, transactionHash){
        console.log("Txn sent. Please wait for confirmation.");
        $('#myBtn').hide();
        $('#loader').show();
        console.log(transactionHash);

         setTimeout(()=>{
          web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {


           if(receipt.status == true){
              $('#loader').hide();
              $('#myBtn').show();
              var inputs = [{ indexed: false,name: "_text", type: "string"}]

              web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
              console.log('status ',receipt);
                    //var message = receipt.events.messageWrite.returnValues['_text'];
               var message = web3.eth.abi.decodeLog(inputs,receipt.logs[0].data,receipt.logs[0].topics)['_text']

               console.log("message: ", message)

               $('#message').html(message);
              })


            }else{
              console.log('status ',receipt.status);

            }

              });
          }, 5000)


   });

}

//read
function getMessage(){
  theContract.methods.getMessage()
  .call({from: currentAccount},
    async function(error, result) {
      if (!error){
        console.log(result);
        $('#message').html(result);
      }
      else
      console.error(error);
    }
  );
}
