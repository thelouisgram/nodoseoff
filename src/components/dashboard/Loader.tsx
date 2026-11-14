import PageLoader from "@/components/ui/PageLoader";

/** Global full-page loader (alarm logomark + soft whims). */
export default function Loader({
  label = "Getting things ready…",
}: {
  label?: string;
}) {
  return <PageLoader label={label} />;
}
