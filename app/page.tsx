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

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const mainContent = (
    <>
      <div className="flex-1 min-w-[300px] flex flex-col items-center justify-center gap-6 p-6 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl">
        <Checkout productId={COMMERCE_PRODUCT_ID}>
          <CheckoutButton coinbaseBranded />
          <CheckoutStatus />
        </Checkout>
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <QRCodeSVG 
            value={COMMERCE_CHECKOUT_URL}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="L"
            includeMargin={false}
          />
        </div>
        <p className="text-sm text-gray-300 mt-2">Scan to pay on mobile</p>
      </div>

      <div className="flex-1 min-w-[300px] flex flex-col items-center justify-center gap-6 p-6 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl">
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

      <div className="flex-1 min-w-[300px] flex flex-col items-center justify-center gap-6 p-6 backdrop-blur-sm bg-white/5 rounded-xl m-2 hover:bg-white/10 transition-all duration-300 shadow-xl">
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

      <main className={`p-8 ${isMobile ? 'flex flex-col' : 'flex flex-row items-stretch'} min-h-screen`}>
        {mainContent}
      </main>
    </div>
  );
}
