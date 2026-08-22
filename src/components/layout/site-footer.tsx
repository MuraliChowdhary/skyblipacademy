import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/src/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-16 lg:px-8 md:grid-cols-4">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-full border border-border" />
            <span className="text-[15px] font-medium tracking-tight">
              Sky Blip <span className="text-muted-foreground">Academy</span>
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {/* Career-first coding programs for engineering students and switchers —
            live cohorts, shipped projects, and a placement cell that owns your
            outcome. */}
            “We don&apos;t teach syntax. We teach the thinking that produces working code.”
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground">
            Navigate
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.name} className="hover:underline">
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5 hover:underline hover:text-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
              <span>Hitech City, Hyderabad, India</span>
            </li>
            <li className="flex items-center gap-2.5 hover:underline hover:text-foreground">
              <Phone className="h-4 w-4 shrink-0 text-foreground " />
              <span>+91 90000 00000</span>
            </li>
            <li className="flex items-center gap-2.5 hover:text-foreground hover:underline">
              <Mail className="h-4 w-4 shrink-0 text-foreground hover:text-foreground" />
              <span>admissions@skyblip.academy</span>
            </li>
            <li className="flex items-center gap-2.5 hover:text-foreground hover:underline">
              <Link href={"/contact"}>
                Help Center
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="mx-auto w-full max-w-6xl px-6 font-mono text-xs text-muted-foreground lg:px-8">
          © {new Date().getFullYear()} Sky Blip Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
