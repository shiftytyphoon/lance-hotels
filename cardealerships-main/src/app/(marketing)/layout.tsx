import { Footer } from "@/components/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
