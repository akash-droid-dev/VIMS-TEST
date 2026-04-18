import { MOCK_BOOKINGS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_BOOKINGS.map((b) => ({ id: b.id }));
}

export default function AdminBookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
