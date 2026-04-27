import { PortfolioClient } from '@/components/PortfolioClient';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('pocketfeel_user_id')?.value || null;

  return <PortfolioClient initialUserId={userId} />;
}
