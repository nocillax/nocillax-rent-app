import { MainLayout } from "@/components/layout/main-layout";

export default function TenantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
