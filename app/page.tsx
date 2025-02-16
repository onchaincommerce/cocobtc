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
  const [isPWA, setIsPWA] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    // Check if running as PWA
    const checkPWA = () => {
      const isStandalone = (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        window.location.href.includes('?mode=pwa') ||
        document.referrer.includes('android-app://')
      );
      
      console.log('PWA Status:', {
        matchMedia: window.matchMedia('(display-mode: standalone)').matches,
        navigatorStandalone: (window.navigator as any).standalone,
        urlMode: window.location.href.includes('?mode=pwa'),
        androidApp: document.referrer.includes('android-app://')
      });
      
      setIsPWA(isStandalone);
    };

    checkMobile();
    checkPWA();

    // Add event listener for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsPWA(e.matches);
    };
    mediaQuery.addListener(handleDisplayModeChange);

    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, []);

  const MORPHO_VAULT_ADDRESS = '0x543257eF2161176D7C8cD90BA65C2d4CaEF5a796';
  const COMMERCE_PRODUCT_ID = '437807eb-e9ff-4fd3-9760-1ee5a7a8d650';
  const COMMERCE_CHECKOUT_URL = `https://commerce.coinbase.com/checkout/${COMMERCE_PRODUCT_ID}`;
  
  const USDC: Token = {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: 8453,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    image: 'https://dynamic-assets.coinbase.com/3c15df5e2ac7d4abbe9499ed9335041f00c620f28e8de2f93474a9f432058742cdf4674bd43f309e69778a26969372310135be97eb183d91c492154176d455b8/asset_icons/9d67b728b6c8f457717154b3a35f9ddc702eae7e76c4684ee39302c4d7fd0bb8.png'
  };
  
  const cbBTC: Token = {
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    chainId: 8453,
    decimals: 8,
    name: 'Coinbase Wrapped BTC',
    symbol: 'cbBTC',
    image: 'https://assets.coingecko.com/coins/images/30791/large/cbBTC.png'
  };

  const swappableTokens = [USDC, cbBTC];

  // Show install instructions when in mobile browser
  if (isMobile && !isPWA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white">
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="max-w-sm mx-auto">
            <img 
              src="/apple-icon-180.png" 
              alt="CocoBTC Logo" 
              className="w-24 h-24 mx-auto mb-6 rounded-xl shadow-lg"
            />
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome to CocoBTC</h1>
            
            {/* Project Explanation */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 text-center">What is CocoBTC?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">💱</span>
                  <p className="text-gray-200">Swap USDC to Coinbase's wrapped Bitcoin (cbBTC) on Base</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">💰</span>
                  <p className="text-gray-200">Earn interest on your cbBTC through Morpho</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-500/20 p-2 rounded-lg flex-shrink-0">💸</span>
                  <p className="text-gray-200">Pay for goods and services using crypto</p>
                </div>
              </div>
            </div>

            {/* Install Instructions */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-center">Install App</h2>
              <p className="text-gray-300 mb-6 text-center text-sm">Add CocoBTC to your home screen for the best experience:</p>
              
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <span className="text-xl">📱</span> On iPhone:
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</span>
                      <div>
                        <p>Tap the Share button</p>
                        <span className="inline-block w-6 h-6 align-middle mt-1">⬆️</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</span>
                      <div>
                        <p>Scroll and tap "Add to Home Screen"</p>
                        <span className="inline-block w-6 h-6 align-middle mt-1">🏠</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">3</span>
                      <p>Tap "Add" in the top right</p>
                    </li>
                  </ol>
                </div>

                <div className="text-left">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <span className="text-xl">🤖</span> On Android:
                  </h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">1</span>
                      <div>
                        <p>Tap the menu</p>
                        <span className="inline-block w-6 h-6 align-middle mt-1">⋮</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">2</span>
                      <p>Tap "Add to Home screen"</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-300 text-center">
              Once installed, you'll be able to connect your wallet and start using CocoBTC
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show wallet connect screen when in PWA and not connected
  if (isPWA && !isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 text-white flex flex-col items-center justify-center p-6">
        <img 
          src="/apple-icon-180.png" 
          alt="CocoBTC Logo" 
          className="w-24 h-24 rounded-xl shadow-lg mb-8"
        />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Start Using CocoBTC</h1>
          <p className="text-gray-300 mb-2">Connect your wallet to begin swapping and earning</p>
          <p className="text-sm text-gray-400">Supports Coinbase Wallet, MetaMask, and Smart Wallets</p>
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
