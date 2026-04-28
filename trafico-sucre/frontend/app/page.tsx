'use client';

import dynamic from 'next/dynamic';

const Mapa = dynamic(() => import('@/components/Mapa'), { ssr: false });

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <Mapa />
    </main>
  );
}