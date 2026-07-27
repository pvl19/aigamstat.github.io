import ContentPage, { metadataFor } from '@/components/ContentPage';
import { jsmYears } from '@/lib/nav';

/**
 * The JSM pages live at the site root as /jsm2026/, /jsm2025/, ... rather than
 * under a /jsm/ parent, so this is a root-level dynamic segment. Only the
 * jsmNNNN values below are generated; static routes such as /about take
 * precedence over this segment.
 */
export function generateStaticParams() {
  return jsmYears().map((year) => ({ jsmYear: `jsm${year}` }));
}

export const dynamicParams = false;

const fileFor = (jsmYear: string) => `${jsmYear}/index.md`;

export async function generateMetadata({ params }: { params: Promise<{ jsmYear: string }> }) {
  const { jsmYear } = await params;
  return metadataFor(fileFor(jsmYear));
}

export default async function Page({ params }: { params: Promise<{ jsmYear: string }> }) {
  const { jsmYear } = await params;
  return <ContentPage url={`/${jsmYear}/`} file={fileFor(jsmYear)} />;
}
