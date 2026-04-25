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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <FormSections />
            </div>
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <LiveResultPanel />
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
