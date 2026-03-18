import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next'

// metadata defined here will be inherited by all children that use it
// Next.js will automatically add the title and metadata to the application
export const metadata: Metadata = {
    // use templates to avoid having to update every page after name change
    title: {
        template: '%s | Acme Dashboard', // %s will be replaced with the specific page title
        default: 'Acme Dashboard',
    },
    description: 'The official Next.js Learn Dashboard built with App Router.',
    metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>{children}</body>
        </html>
    )
}
