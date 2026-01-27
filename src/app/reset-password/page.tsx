import { Suspense } from "react";
import ResetPasswordContent from "./ResetPasswordContent";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

export default async function ResetPasswordPage(props: Props) {
  const searchParams = await props.searchParams;
  const token = searchParams.token as string | undefined;

  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent token={token} />
    </Suspense>
  );
}
