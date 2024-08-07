import {
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CLIENT_ID, cognitoClient } from "./config";

export const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const queryKeys = {
  getTodos: "getTodos",
  getAppList: "getAppList",
  getAppListManager: "getAppListManager",
  getAppDetail: "getAppDetai",
  getAppInstalledList: "getAppInstalledList",
  getAppRequesting: "getAppRequesting",
  getAppStore: "getAppStore",

  getUserInfo: "getUserInfo",
  updateUserInfo: "updateUserInfo",
  assignUser: "assignUser",
  getListUser: "getListUser",
  getUserDetail: "getUserDetail",
  updateUser: "updateUser",

  getPlatformSettings: "getPlatformSettings",
  getListNew: "getListNew",
  detailCategoty: "detailCategoty",
};

export const LANG_ENUM = {
  vi: "vi",
  en: "en",
};

export enum PERMISSION_ENUM {
  PUBLIC = "PUBLIC",
  ADMIN = "ADMIN",
  USER = "CUSTOMER",
  APP_MANAGER = "MANAGER",
}

export const PermissionOptions = Object.entries(PERMISSION_ENUM)
  .filter((el) => {
    const [key, value] = el;
    return key !== PERMISSION_ENUM.PUBLIC && value !== PERMISSION_ENUM.ADMIN;
  })
  .map((el) => {
    const [key, value] = el;
    return {
      label: key,
      value: value,
    };
  });

export const NUMBER_DEFAULT_ROW_PER_PAGE = 5;
export const NUMBER_DEFAULT_PAGE = 1;
export const API_KEY_TINY_EDITOR =
  "pyfe4ygo4uskbsupyjwkvj16peu92u1qlp1liqki0rnv1zct";

export const SIZE_ICON_DEFAULT = 24;

