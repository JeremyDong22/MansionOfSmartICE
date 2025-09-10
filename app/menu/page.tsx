// Menu Page - Redirects to dynamic menu
// All menu content is now in the dynamic menu page

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/menu/dynamic');
  }, [router]);
  
  return null;
}