import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - JamSync",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
