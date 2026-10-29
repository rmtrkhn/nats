import { asset } from "../../lib/asset";

export function SiteHeader() {
  const home = asset("/");

  return (
    <header className="nav">
      <div className="page nav-inner">
        <a className="brand" href={`${home}#top`} aria-label="NATS">
          <img src={asset("/nats-logo.png")} alt="NATS" width={196} height={72} />
        </a>
        <nav className="nav-links" aria-label="Strona">
          <a href={`${home}#realizacje`}>Realizacje</a>
          <a href={`${home}#studio`}>Studio</a>
          <a href={`${home}#kontakt`}>Kontakt</a>
        </nav>
      </div>
    </header>
  );
}
