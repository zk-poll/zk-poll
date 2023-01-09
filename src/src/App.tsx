import React from 'react';
import logo from './logo.svg';
import './App.css';
// import Proposals from './components/Proposals';
// import { useAllProposals } from './wrappers/nounsDao';
import GeneratePoll from './GeneratePoll';
import Modal from './Modal';
import Header from './Header';


function App() {
  // const { data: proposals } = useAllProposals();
  // const {address, isConnected} = useAccount()

  return (
    <div className="App">
        <header className="App-header">
          <Modal/>
        </header>
        <div className="App-content">
          <GeneratePoll/>
        </div>
      </div>
      /* <Proposals proposals={proposals} /> */
  )

}

export default App;
