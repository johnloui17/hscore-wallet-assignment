import { getAllWallets } from '@/lib/api';
import { PortfolioClient } from '@/components/PortfolioClient';

// Ensure the page is always dynamic to show fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data on the server
  let wallets = [];
  try {
    wallets = await getAllWallets();
  } catch (error) {
    console.error("Failed to fetch wallets:", error);
  }

  return <PortfolioClient wallets={wallets} />;
}
