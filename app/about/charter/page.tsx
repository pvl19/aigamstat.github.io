import ContentPage, { metadataFor } from '@/components/ContentPage';

const URL = '/about/charter.html';
const FILE = 'about/charter.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return <ContentPage url={URL} file={FILE} />;
}
