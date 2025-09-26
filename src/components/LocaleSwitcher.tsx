'use client';
import {usePathname, useRouter} from 'next/navigation';
import {locales, type Locale} from '@/src/i18n/locales.ts';

export default function LocaleSwitcher({current}:{current: Locale}) {
  const pathname = usePathname();
  const router = useRouter();
  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Locale;
    if (!pathname) return;
    const parts = pathname.split('/');
    parts[1] = next;
    router.push(parts.join('/'));
  }
  return (
    <select onChange={onChange} value={current} aria-label="Change language">
      {locales.map((loc) => (
        <option key={loc} value={loc}>{loc}</option>
      ))}
    </select>
  );
}
