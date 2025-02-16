'use client';

import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { Swap, SwapAmountInput, SwapToggleButton, SwapButton, SwapMessage, SwapToast } from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { Earn } from '@coinbase/onchainkit/earn';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Check if device is mobile
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    // Check if app is installed (running in standalone mode)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Show install prompt if on mobile and not installed
    if (isMobile && !isStandalone) {
      setShowInstallPrompt(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isStandalone]);

  const MORPHO_VAULT_ADDRESS = '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796';
  const COMMERCE_PRODUCT_ID = '437807eb-e9ff-4fd3-9760-1ee5a7a8d650';
  const COMMERCE_CHECKOUT_URL = `https://commerce.coinbase.com/checkout/${COMMERCE_PRODUCT_ID}`;
  
  // Define USDC and cbBTC tokens for Base (chainId: 8453)
  const USDC: Token = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    chainId: 8453,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png'
  };
  
  const cbBTC: Token = {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC on Base (8 decimals)
    chainId: 8453,
    decimals: 8,
    name: 'Coinbase Wrapped BTC',
    symbol: 'cbBTC',
    image: 'https://assets.coingecko.com/coins/images/30791/large/cbBTC.png'
  };

  const swappableTokens = [USDC, cbBTC];

  // Add to Home Screen Prompt for mobile browsers
  if (showInstallPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white">
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to CocoBTC</h1>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4">Install App</h2>
            <p className="mb-6">For the best experience, please add CocoBTC to your home screen:</p>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</span>
                <p>Tap the share button <span className="inline-block w-6 h-6 align-middle">⬆️</span> in your browser</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</span>
                <p>Scroll down and tap "Add to Home Screen"</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</span>
                <p>Tap "Add" to install</p>
              </div>
            </div>
            <button 
              onClick={() => setShowInstallPrompt(false)}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 px-4 rounded-lg"
            >
              Continue in Browser
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Connect Screen (only shown when app is installed)
  if (isMobile && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to CocoBTC</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to get started</p>
          <p className="text-sm text-gray-400 mb-8">Supports Coinbase Wallet, MetaMask, and more</p>
        </div>
        <div className="w-full max-w-sm">
          <Wallet>
            <ConnectWallet className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
              <Avatar className="h-6 w-6" />
              <span className="text-lg">Connect Wallet</span>
            </ConnectWallet>
          </Wallet>
        </div>
      </div>
    );
  }

  const mainContent = (
    <>
      <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-[300px] flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl`}>
        <h2 className="text-xl font-bold mb-2">Pay with Crypto</h2>
        <Checkout productId={COMMERCE_PRODUCT_ID}>
          <CheckoutButton coinbaseBranded />
          <CheckoutStatus />
        </Checkout>
        <div className="mt-2 p-3 bg-white rounded-lg shadow-lg">
          <QRCodeSVG 
            value={COMMERCE_CHECKOUT_URL}
            size={isMobile ? 150 : 200}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
        </div>
        <p className="text-sm text-gray-300">Scan to pay on another device</p>
      </div>

      <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-[300px] flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl`}>
        <h2 className="text-xl font-bold mb-2">Swap USDC to cbBTC</h2>
        <Swap>
          <SwapAmountInput
            label="Sell"
            swappableTokens={swappableTokens}
            token={USDC}
            type="from"
          />
          <SwapToggleButton className="hover:rotate-180 transition-all duration-500" />
          <SwapAmountInput
            label="Buy"
            swappableTokens={swappableTokens}
            token={cbBTC}
            type="to"
          />
          <SwapButton className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300" />
          <SwapMessage />
          <SwapToast />
        </Swap>
      </div>

      <div className={`${isMobile ? 'w-full' : 'flex-1'} min-w-[300px] flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl`}>
        <h2 className="text-xl font-bold mb-2">Earn Interest</h2>
        <Earn vaultAddress={MORPHO_VAULT_ADDRESS} />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white">
      <div className="fixed top-4 right-4 z-10">
        <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className={color.foregroundMuted} />
              <EthBalance />
            </Identity>
            <WalletDropdownDisconnect className="hover:bg-red-500/20 transition-colors duration-200" text="Disconnect Wallet" />
          </WalletDropdown>
        </Wallet>
      </div>

      <main className={`p-4 ${isMobile ? 'flex flex-col gap-6 pt-20' : 'flex flex-row items-stretch'} min-h-screen`}>
        {mainContent}
      </main>
    </div>
  );
}
