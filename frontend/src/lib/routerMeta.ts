import type { UserRole } from "@/interfaces/user.interface";

export interface IRouterMeta {
  name?: string;
  path: string;
  isShow: boolean;
  isCommon?: boolean;
  isAuth?: boolean;
  role?: UserRole;
  icon?: string;
}

export type RouterMetaType = {
  [key: string]: IRouterMeta;
};

const routerMeta: RouterMetaType = {
  HomePage: {
    name: "Home",
    path: "/",
    isShow: true,
    isAuth: true,
  },
  AuthPage: {
    name: "Auth Page",
    path: "/auth",
    isShow: true,
    isAuth: false,
  },
  AdminDashboardPage: {
    name: "Admin Dashboard",
    path: "/admin",
    isAuth: true,
    isShow: false,
    role: "ADMIN",
  },
  NotFoundPage: {
    path: "/*",
    isShow: false,
  },
};

export default routerMeta;
