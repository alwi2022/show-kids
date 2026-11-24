import type { SVGProps } from "react";
export type IconName =
  | "search"
  | "play"
  | "file"
  | "book"
  | "admin"
  | "menu"
  | "close"
  | "plus"
  | "check"
  | "logout"
  | "download"
  | "leaf"
  | "music"
  | "craft"
  | "sun";
const paths: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  play: <path d="m9 5 11 7-11 7V5Z" />,
  file: (
    <>
      <path d="M14 3H5v18h14V8l-5-5Z" />
      <path d="M14 3v6h5M8 13h8M8 17h6" />
    </>
  ),
  book: (
    <>
      <path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1ZM12 5v15" />
    </>
  ),
  admin: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  plus: <path d="M12 4v16M4 12h16" />,
  check: <path d="m4 12 5 5L20 6" />,
  logout: (
    <>
      <path d="M10 4H4v16h6M9 12h12m-5-5 5 5-5 5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 3C8 1 2 9 6 16s17 1 14-13ZM4 21 16 8" />
    </>
  ),
  music: (
    <>
      <path d="M9 17V5l11-2v12M9 8l11-2" />
      <ellipse cx="6" cy="18" rx="3" ry="2" />
      <ellipse cx="17" cy="16" rx="3" ry="2" />
    </>
  ),
  craft: (
    <>
      <circle cx="6" cy="17" r="3" />
      <circle cx="6" cy="7" r="3" />
      <path d="m8 9 12 11M8 15 20 3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
};
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
