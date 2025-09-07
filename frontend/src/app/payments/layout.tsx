import { MainLayout } from "@/components/layout/main-layout";

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
