import { getAllWallets } from '@/lib/api';
import { PortfolioClient } from '@/components/PortfolioClient';

// Enable edge runtime for performance if needed, or keep node
// export const runtime = 'edge';

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
