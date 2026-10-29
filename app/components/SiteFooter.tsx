import { asset } from "../../lib/asset";

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="page foot-inner">
        <span>© {new Date().getFullYear()} NATS · Warszawa</span>
        <a href={asset("/polityka/")}>Polityka prywatności</a>
      </div>
    </footer>
  );
}
