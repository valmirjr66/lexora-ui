import { useCallback, useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import useToaster from "./hooks/useToaster";
import httpCallers from "./service";
import { useUserInfoStore } from "./store";

export default function RestrictWrapper() {
  const userId = localStorage.getItem("userId");

  const userInfoStore = useUserInfoStore();

  const { triggerToast } = useToaster({ type: "error" });

  const fetchUserInfo = useCallback(async () => {
    try {
      const { data: userData } = await httpCallers.get(`users/${userId}`);

      userInfoStore.setData({
        id: userData.id,
        email: userData.email,
        fullname: userData.fullname,
        profilePicFileName: userData.profilePicFileName,
        birthdate: userData.birthdate,
      });
    } catch {
      triggerToast();
    }
  }, [triggerToast, userId]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return userId ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
