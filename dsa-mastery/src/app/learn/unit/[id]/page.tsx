import React, { Suspense } from 'react';
import UnitClientView from '@/components/learn/UnitClientView';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const unitId = parseInt(resolved.id) || 1;

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted">Loading Unit...</div>}>
      <UnitClientView unitId={unitId} />
    </Suspense>
  );
}
