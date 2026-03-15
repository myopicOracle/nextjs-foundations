'use client'; // note the client-side rendering 

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();

  function handleSearch(term: string) {
    // console.log(term);
    const params = new URLSearchParams(searchParams); // used to create param strings
    const pathname = usePathname();
    const { replace } = useRouter(); // destructured to avoid fully qualified import

    // set the params string
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    // method of 'useRouter'
    replace(`${pathname}?${params.toString()}`); 
    // ${pathname} is the current path, in your case, "/dashboard/invoices".
    // As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
    // replace(${pathname}?${params.toString()}) updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "Lee".
    // The URL is updated without reloading the page, thanks to Next.js's client-side navigation
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
