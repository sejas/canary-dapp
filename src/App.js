import React from 'react';
import './App.css';
import {
  Box, Divider, Typography, TextField, Button, Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { Tweet } from './components/tweet';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { useContract } from './hooks/use-contract';
import { useAccount } from './hooks/use-account';

const LOADING_TWEET = {
  id: 'loading',
  owner: 'Sending tweet. Your transaction is being mined...',
  tweetText: '',
};

const TweetsContainer = styled(Box)`
    display: flex;
    align-items: stretch;
    flex-direction: column;
    gap: 1rem;
    width: 800px;
    max-width: 90%;
    margin: 24px auto;
`;



export default function App() {
  const { ethereum } = window;
  const { currentAccount, isValidChain, setCurrentAccount, setChainId } = useAccount(ethereum);
  const contract = useContract(ethereum, isValidChain);
  const [tweets, setTweets] = React.useState([]);
  const [isTweeting, setIsTweeting] = React.useState(false);
  const tweetBoxRef = React.useRef(null);

  /**
   * Add Listeners to receive contract events
   */
  React.useEffect(() => {
    if (!contract) {
      return;
    }

    const tweetListener = async (_address, tweetId) => {
      const tweet = await contract.getTweet(tweetId);
      setTweets(tweets => {
        if (!tweets.find((t) => tweetId.eq(t.id))) {
          console.log('new tweet', tweet);
          return [...tweets, tweet];
        }
        return tweets;
      });
    };
    contract.on('AddTweet', tweetListener);

    const likeListener = async (_address, tweetId) => {
      const tweet = await contract.getTweet(tweetId);
      setTweets(tweets => {
        const indexArray = tweets.findIndex((t) => tweetId.eq(t.id));
        console.log('LikedTweet', tweet, indexArray);
        if (indexArray > 0) {
          return tweets.map((t) => (tweetId.eq(t.id) ? tweet : t));
        } else {
          return tweets;
        }
      });
    };
    contract.on('LikedTweet', likeListener);

    const deleteListener = async (tweetId) => {
      setTweets(tweets => {
        const indexArray = tweets.findIndex((t) => tweetId.eq(t.id));
        console.log('DeleteTweet', indexArray, tweetId);
        if (indexArray > 0) {
          return tweets.filter((t) => !tweetId.eq(t.id));
        } else {
          return tweets;
        }
      });
    };
    contract.on('DeleteTweet', deleteListener);

    return () => {
      contract.off('AddTweet', tweetListener);
      contract.off('LikedTweet', likeListener);
      contract.off('DeleteTweet', deleteListener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  /**
   * Refresh all tweets if the contract, user or chain changes
   */
  React.useEffect(() => {
    if (!currentAccount || !isValidChain || !contract) {
      return;
    }
    contract.getAllTweets().then((tweets) => {
      setTweets(tweets);
    });
  }, [currentAccount, contract, isValidChain]);


  /**
   * Login the user account
   */
  const connectWallet = React.useCallback(async () => {
    try {
      if (!ethereum) {
        // eslint-disable-next-line no-alert
        alert('Get MetaMask!');
        return;
      }

      // TODO 2: Uncomment the following three lines to retreive the accounts
      // const accounts = await ethereum.request({
      //   method: 'eth_requestAccounts',
      // });
      // TODO 3: set the currentAccount to accounts[0]
      
      // TODO 4: uncomment and set the chainId to the current chainId. Check ethereum.chainId
      // const chainId = await ethereum.request({ method: 'eth_chainId' });

    } catch (error) {
      console.log(error);
    }
  }, [ethereum, setChainId, setCurrentAccount]);

  /**
   * Try to Autologin the user account
   */
  React.useEffect(() => {
    connectWallet();
  }, [ethereum, connectWallet]);

  /**
   * Methods to interact with the contract
   */
  async function tweet() {
    console.log('tweeting', tweetBoxRef.current.value);
    try {
      setIsTweeting(true);
      const tx = await contract.addTweet(tweetBoxRef.current.value);
      console.log('Mining...', tx.hash);
      await tx.wait();
      console.log('Mined -- ', tx.hash);
      tweetBoxRef.current.value = '';
    } catch (error) {
      console.error(error);
    } finally {
      setIsTweeting(false);
    }
  }

  async function like(tweetId) {
    // TODO 5: implement this function
    console.log('TODO: liking', tweetId);
  }

  async function deleteTweet(tweetId) {
    // TODO 6: implement this function
    console.log('TODO: deleting', tweetId);
  }

  return (
    <main>
      <Header currentAccount={currentAccount} />
      {isValidChain && currentAccount && (
        <div>

          <TweetsContainer>
            {/* Text Input */}
            <TextField
              inputProps={{ ref: tweetBoxRef }}
              label="Your tweet"
              multiline
              rows={3}
              variant="filled"
            />
            <Button onClick={tweet} variant="contained" sx={{ alignSelf: 'flex-end' }}>
              Send Tweet
            </Button>
            {/* Info */}
            <Typography>{`Tweets: ${tweets.length}`}</Typography>
            <Divider />
            {/* Tweets */}
            {isTweeting && <Tweet
              tweet={{...LOADING_TWEET, tweetText: tweetBoxRef.current.value}}
              currentAccount={''}
              sx={{backgroundColor: '#f5f5f5'}}
            />}
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.id}
                tweet={tweet}
                currentAccount={currentAccount}
                onLike={() => like(tweet.id)}
                onDelete={() => deleteTweet(tweet.id)}
              />
            )).reverse()}
          </TweetsContainer>
        </div>
      )}

      {!isValidChain && (<Alert sx={{m: 8}} severity="warning">Please change your network to Rinkeby!</Alert>)}
      
      {isValidChain && !currentAccount && (<Box sx={{ m: 8, justifyContent: 'center', display: 'flex' }}>
        <Button justify="center" onClick={connectWallet} variant="contained">
            Connect Wallet
        </Button>
      </Box>
      )}
 
      <Footer />
    </main>
  );
}
