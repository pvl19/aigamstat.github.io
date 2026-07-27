export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-600 sm:px-6">
        <p>
          Last updated July 27, 2026.
        </p>
        <p>
          Hosted on{' '}
          <a
            href="https://pages.github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-slate-900"
          >
            GitHub Pages
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
