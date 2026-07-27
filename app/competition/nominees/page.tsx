import ContentPage, { metadataFor } from '@/components/ContentPage';

const URL = '/competition/nominees.html';
const FILE = 'competition/nominees.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return <ContentPage url={URL} file={FILE} />;
}
