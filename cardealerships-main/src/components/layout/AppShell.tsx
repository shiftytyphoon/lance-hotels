// AppShell component - header + sidebar for /app pages
// TODO: Implement full app shell with navigation

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header>
        <nav>
          {/* Logo, nav links, user menu */}
        </nav>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside>
          {/* Navigation links:
            - Dashboard
            - Agents
            - Settings
          */}
        </aside>

        {/* Main content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
