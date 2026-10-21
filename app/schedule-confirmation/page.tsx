import ConfirmationClient from "@/components/schedule/ConfirmationClient";

export const metadata = {
  title: "Pickup Confirmed",
};

export default async function ScheduleConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  return (
    <section className="ftco-section">
      <div className="container">
        <ConfirmationClient refParam={params.ref || ""} />
      </div>
    </section>
  );
}
