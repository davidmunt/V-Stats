import { useState } from "react";
import UpdateData from "@/components/profile/UpdateData";
import UpdatePassword from "@/components/profile/UpdatePassword";
import ShowData from "@/components/profile/ShowData";
import { useCurrentUserQuery } from "@/queries/auth/useCurrentUser";
import LoadingFallback from "@/components/LoadingFallback";

const ProfilePage = () => {
  const [currentView, setCurrentView] = useState<string>("showData");
  const { data: userData, isLoading } = useCurrentUserQuery();

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === "showData" && (
          <ShowData
            userData={userData}
            onEdit={() => setCurrentView("updateData")}
            onChangePassword={() => setCurrentView("updatePassword")}
          />
        )}
        {currentView === "updateData" && <UpdateData userData={userData} onCancel={() => setCurrentView("showData")} />}
        {currentView === "updatePassword" && <UpdatePassword onCancel={() => setCurrentView("showData")} />}
      </main>
    </div>
  );
};

export default ProfilePage;
