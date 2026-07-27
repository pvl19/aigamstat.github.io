import ContentPage, { metadataFor } from '@/components/ContentPage';

const URL = '/contact/';
const FILE = 'contact.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return <ContentPage url={URL} file={FILE} />;
}
