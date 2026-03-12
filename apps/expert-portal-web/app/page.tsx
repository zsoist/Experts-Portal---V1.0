import { PageShell } from "@experts/ui";

import { AppNav } from "../components/app-nav";
import { ExecutiveShowcase } from "../components/executive-showcase";

export default function HomePage() {
  return (
    <PageShell
      title="What Dialectica’s expert portal could feel like in a live CPO demo"
      subtitle="A visual MVP that emulates the expert journey, the ops controls, and the business value without waiting for every integration to be production-ready."
      accent={<AppNav currentPath="/" />}
    >
      <ExecutiveShowcase />
    </PageShell>
  );
}
