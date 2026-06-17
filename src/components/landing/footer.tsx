import { ShieldCheck, Globe, ExternalLink, Share2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
              <span className="text-lg font-bold text-white">
                JobShield AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered protection against job scams. Verify any job offer in
              seconds and stay safe from fraud.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "How It Works", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 JobShield AI. Built with ❤️ to protect job seekers.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Globe, href: "#", label: "Website" },
              { icon: ExternalLink, href: "#", label: "GitHub" },
              { icon: Share2, href: "#", label: "Share" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary hover:bg-indigo-500/10 border border-border hover:border-indigo-500/30 text-muted-foreground hover:text-indigo-400 transition-all"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
