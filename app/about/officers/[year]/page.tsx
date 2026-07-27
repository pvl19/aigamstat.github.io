import ContentPage, { metadataFor } from '@/components/ContentPage';
import PastOfficers from '@/components/PastOfficers';
import { officerYears } from '@/lib/nav';

/** One page per past year of officers, from content/about/officers/YYYY.md. */
export function generateStaticParams() {
  return officerYears().map((year) => ({ year }));
}

// Only the years present on disk exist; anything else is a build error, not a
// silently generated empty page.
export const dynamicParams = false;

const fileFor = (year: string) => `about/officers/${year}.md`;

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return metadataFor(fileFor(year));
}

export default async function Page({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const url = `/about/officers/${year}.html`;
  return (
    <ContentPage url={url} file={fileFor(year)}>
      <PastOfficers url={url} />
    </ContentPage>
  );
}
