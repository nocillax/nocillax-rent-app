import { MainLayout } from "@/components/layout/main-layout";

export default function BillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
