import { MOCK_VENUES } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_VENUES.map((v) => ({ id: v.id }));
}

export default function AdminVenueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
