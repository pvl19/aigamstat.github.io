import ContentPage, { metadataFor } from '@/components/ContentPage';

const URL = '/about/';
const FILE = 'about/index.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return <ContentPage url={URL} file={FILE} />;
}
