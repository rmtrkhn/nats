import { SetHtmlLang } from "../components/SetHtmlLang";

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetHtmlLang locale="en" />
      {children}
    </>
  );
}
