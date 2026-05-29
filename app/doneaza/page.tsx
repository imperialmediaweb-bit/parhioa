import { redirect } from 'next/navigation';

export const metadata = { title: 'Donează' };

export default function DoneazaPage() {
  redirect('/donations/strangere-de-fonduri-pentru-construirea-bisericii');
}
