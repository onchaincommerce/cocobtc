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
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[var(--ock-bg-default)] text-[var(--ock-text-foreground)] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-4xl font-mono mb-6 animate-pulse">[CocoBTC]</h1>
          <div className="bg-[var(--ock-bg-alternate)] border border-[var(--ock-line-primary)] rounded-lg p-6 mb-8">
            <Wallet>
              <ConnectWallet className="w-full py-4 px-6 rounded-lg bg-[var(--ock-bg-primary)] hover:bg-[var(--ock-bg-primary-hover)] transition-colors border border-[var(--ock-line-primary)] text-[var(--ock-text-foreground)] font-mono flex items-center justify-center gap-3">
                <span className="text-lg">CONNECT_WALLET</span>
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ock-bg-default)] text-[var(--ock-text-foreground)]">
      {/* Header with wallet */}
      <div className="fixed top-0 left-0 right-0 bg-[var(--ock-bg-inverse)] backdrop-blur-sm border-b border-[var(--ock-line-primary)] p-4 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-mono">[CocoBTC]</h1>
          <Wallet>
            <ConnectWallet>
              <div className="font-mono text-sm border border-[var(--ock-line-primary)] rounded px-3 py-1">
                <Name />
              </div>
            </ConnectWallet>
            <WalletDropdown>
              <div className="bg-[var(--ock-bg-inverse)] border border-[var(--ock-line-primary)] rounded-lg overflow-hidden">
                <Identity className="px-4 pt-3 pb-2 font-mono" hasCopyAddressOnClick>
                  <Name />
                  <Address className="text-[var(--ock-text-foreground-muted)]" />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect className="px-4 py-2 hover:bg-[var(--ock-bg-primary)] transition-colors text-[var(--ock-text-error)]" text="DISCONNECT" />
              </div>
            </WalletDropdown>
          </Wallet>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-20 p-4 max-w-7xl mx-auto space-y-6">
        {/* Swap Section */}
        <div className="bg-[var(--ock-bg-alternate)] border border-[var(--ock-line-primary)] rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-xl font-mono mb-4 px-2">{`>`} SWAP_USDC_TO_CBBTC</h2>
          <div className="swap-container">
            <Swap>
              <SwapAmountInput
                label="INPUT"
                swappableTokens={swappableTokens}
                token={USDC}
                type="from"
              />
              <SwapToggleButton className="mx-auto my-2 hover:rotate-180 transition-all duration-500" />
              <SwapAmountInput
                label="OUTPUT"
                swappableTokens={swappableTokens}
                token={cbBTC}
                type="to"
              />
              <SwapButton className="w-full mt-4" />
              <SwapMessage className="mt-2 font-mono text-sm" />
              <SwapToast />
            </Swap>
          </div>
        </div>

        {/* Earn Section */}
        <div className="bg-[var(--ock-bg-alternate)] border border-[var(--ock-line-primary)] rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-xl font-mono mb-4 px-2">{`>`} EARN_INTEREST</h2>
          <div className="earn-container">
            <Earn 
              vaultAddress={MORPHO_VAULT_ADDRESS}
            />
          </div>
        </div>

        {/* Pay Section */}
        <div className="bg-[var(--ock-bg-alternate)] border border-[var(--ock-line-primary)] rounded-xl p-4 backdrop-blur-sm">
          <h2 className="text-xl font-mono mb-4 px-2">{`>`} PAY_WITH_CRYPTO</h2>
          <div className="checkout-container space-y-4">
            <Checkout productId={COMMERCE_PRODUCT_ID}>
              <CheckoutButton />
              <CheckoutStatus className="mt-2 font-mono text-sm" />
            </Checkout>
            {isMobile && (
              <div className="mt-4 p-4 bg-white rounded-lg mx-auto max-w-[200px]">
                <QRCodeSVG 
                  value={COMMERCE_CHECKOUT_URL}
                  size={150}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
