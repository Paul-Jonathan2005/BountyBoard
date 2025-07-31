import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react';



export default function App() {
  const walletManager = new WalletManager({
    wallets: [
      WalletId.PERA,
    ],
    defaultNetwork: NetworkId.TESTNET,
    dappMetadata: {
      name: 'Algo Bounty Board'
    }
  })

  return (
    <WalletProvider
      manager={walletManager}
    >
      <Router>
        <AppRoutes />
      </Router>
    </WalletProvider>
  );
}
