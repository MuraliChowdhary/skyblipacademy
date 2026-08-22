export default function VerifyCertificatePage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 lg:px-8">
      <p className="font-mono text-xs text-muted-foreground">verify certificate</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
        Verify a Sky Blip certificate
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Certificate ID lookup goes here — this needs the backend certificate
        registry in place before it can do anything real, so it&apos;s
        stubbed until that&apos;s built.
      </p>
    </section>
  );
}
