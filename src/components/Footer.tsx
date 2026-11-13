import { ArrowUp } from "lucide-react";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Button } from "@astryxdesign/core/Button";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="mono w-8 h-8 grid place-items-center border hair text-xs font-bold" style={{ color: "var(--color-text-accent)" }}>
            AK
          </div>
          <div>
            <div className="text-xs font-medium">© 2026 Anand Kalirana. All rights reserved.</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              Designed &amp; Built with precision
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton label="GitHub" variant="ghost" href="https://github.com/AnandKalirana" target="_blank" rel="noopener noreferrer" icon={<GithubIcon size={16} />} />
          <IconButton label="LinkedIn" variant="ghost" href="https://www.linkedin.com/in/anand-kalirana-572212310/" target="_blank" rel="noopener noreferrer" icon={<LinkedinIcon size={16} />} />
          <Button label="Back to top" variant="ghost" size="sm" href="#hero" icon={<ArrowUp size={14} />} />
        </div>
      </div>
    </footer>
  );
}
