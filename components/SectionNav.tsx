import { href } from '@/lib/site';
import { currentJsmYear, jsmYears, winnerYears } from '@/lib/nav';
import { pillBase, pillCurrent, pillIdle } from './navStyles';
import YearDropdown from './YearDropdown';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label} className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-2.5 sm:px-6">
        {children}
      </div>
    </nav>
  );
}

function Item({ label, url, current }: { label: string; url: string; current: boolean }) {
  return (
    <a
      href={href(url)}
      aria-current={current ? 'page' : undefined}
      className={`${pillBase} ${current ? pillCurrent : pillIdle}`}
    >
      {label}
    </a>
  );
}

/**
 * The second navigation row. Which row appears is decided by the page's URL,
 * so a new page in the right folder picks up the right sub-navigation.
 * Home, Join AIG, News and ASAIP are single pages and get no row.
 */
export default function SectionNav({ url }: { url: string }) {
  if (url.startsWith('/about')) {
    // Past years are chosen on the Officers page itself (see PastOfficers),
    // not from this row -- they are part of Officers rather than a fourth
    // section alongside it.
    return (
      <Row label="About Us sections">
        <Item label="General" url="/about/" current={url === '/about/'} />
        <Item label="Officers" url="/about/officers/" current={url.startsWith('/about/officers')} />
        <Item label="Charter" url="/about/charter.html" current={url.includes('/charter')} />
      </Row>
    );
  }

  if (url.startsWith('/competition')) {
    const years = winnerYears();
    const active = years.find((y) => url.includes(y));
    return (
      <Row label="Student Paper Competition sections">
        <Item label="Current Competition" url="/competition/" current={url === '/competition/'} />
        <YearDropdown
          label="Previous Winners"
          activeYear={active}
          items={years.map((y) => ({
            label: y,
            url: `/competition/winners/${y}.html`,
            current: y === active,
          }))}
        />
      </Row>
    );
  }

  if (url.startsWith('/jsm')) {
    const current = currentJsmYear();
    const past = jsmYears().filter((y) => y !== current);
    const active = past.find((y) => url.includes(y));
    return (
      <Row label="JSM years">
        <Item label={`JSM ${current}`} url={`/jsm${current}/`} current={url.includes(current)} />
        <YearDropdown
          label="Past Years"
          activeYear={active}
          items={past.map((y) => ({ label: `JSM ${y}`, url: `/jsm${y}/`, current: y === active }))}
        />
      </Row>
    );
  }

  return null;
}
