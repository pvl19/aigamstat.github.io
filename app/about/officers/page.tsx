import ContentPage, { metadataFor } from '@/components/ContentPage';
import PastOfficers from '@/components/PastOfficers';

const URL = '/about/officers/';
const FILE = 'about/officers/index.md';

export const generateMetadata = () => metadataFor(FILE);
export default function Page() {
  return (
    <ContentPage url={URL} file={FILE}>
      <PastOfficers url={URL} />
    </ContentPage>
  );
}
