import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 py-2">
        <Link href="/">
          <div className="flex items-center font-medium">
            <Home className="mr-2 h-4 w-4" />
            홈으로
          </div>
        </Link>
      </div>
    </nav>
  );
}
