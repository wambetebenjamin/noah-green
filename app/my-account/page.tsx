import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AccountDashboard from "@/components/account/AccountDashboard";
import { IMAGES, layeredBg } from "@/lib/images";

export const metadata = {
  title: "My Account",
};

export default async function MyAccountPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=%2Fmy-account");
  }
  const name = session.user.name || session.user.email;
  return (
    <>
      <div
        className="hero-wrap hero-wrap-2 ng-hero-2"
        style={{ backgroundImage: layeredBg(IMAGES.heroSorting.remote, IMAGES.heroSorting.local) }}
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-start">
            <div className="col-md-8 ftco-animate">
              <h2 className="subheading">Karibu tena</h2>
              <h1 className="mb-3">{name}</h1>
              <p>Your points, pickups and personal impact in one place.</p>
            </div>
          </div>
        </div>
      </div>
      <section className="ftco-section">
        <div className="container">
          <AccountDashboard email={session.user.email} name={name} />
        </div>
      </section>
    </>
  );
}
