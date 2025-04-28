import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Sidebar from "../../components/Sidebar"; // Import Sidebar component

const Dashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session
      return;
    }

    // Redirect user based on their role
    if (session.user.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (session.user.role === "DOCTOR") {
      router.push("/dashboard/doctor");
    } else if (session.user.role === "PATIENT") {
      router.push("/dashboard/patient");
    }
  }, [session, router]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 flex-1">
        {/* Loading or redirecting logic */}
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    </div>
  ); // This will show while redirecting
};

export default Dashboard;
