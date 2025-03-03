import type { QueryClient } from "@tanstack/react-query";
import tailwind from "@/app/index.css?url";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  type ReactNode,
  Scripts,
} from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      links: [
        { rel: "stylesheet", href: tailwind },
      ],
    }),
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
