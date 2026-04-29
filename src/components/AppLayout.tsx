import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AppLayout({
  children,
  searchPlaceholder,
}: {
  children: React.ReactNode;
  searchPlaceholder?: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar searchPlaceholder={searchPlaceholder} />
        <div className="flex-1 px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
