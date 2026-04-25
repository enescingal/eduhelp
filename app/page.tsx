import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FormSections } from "@/components/form/FormSections";
import { LiveResultPanel } from "@/components/result/LiveResultPanel";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Page() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-6 flex-1">
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <aside className="sticky top-14 lg:top-20 z-20 lg:order-2 lg:self-start -mx-4 px-4 lg:mx-0 lg:px-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:bg-transparent lg:backdrop-blur-none py-2 lg:py-0">
              <LiveResultPanel />
            </aside>
            <div className="min-w-0 lg:order-1">
              <FormSections />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
