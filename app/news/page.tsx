import ContentPage, { metadataFor } from '@/components/ContentPage';

const URL = '/news.html';
const FILE = 'news.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return <ContentPage url={URL} file={FILE} />;
}
