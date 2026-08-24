import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Welcome
        </p>
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          Home Page
        </h3>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Welcome to the Fluento web app! Shadcn is now installed and available for
          UI work.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </div>
  );
}
