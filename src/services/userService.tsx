import queryString from "query-string";
import { AUTH_URL, UPLOAD, USER_URL } from "../consts/apiUrl";
import { PERMISSION_ENUM } from "../consts/index";
import {
  PromiseResponseBase,
  RequestPagingCommon,
  ResponsePagingCommon,
} from "interfaces/common";
import { UserInfo } from "../interfaces/user";
import httpService from "./httpServices";

export interface RequestUpdateUserInfo {
  firstname: string;
  lastname: string;
  company: string;
  address: string;
  phoneNumber: string;
}

export interface RequestAssignUser {
  username: string;
  role?: string;
  appId?: string;
}

export interface RequestGetListUser extends RequestPagingCommon {
  role?: PERMISSION_ENUM | string;
  appId?: string;
}

class UserService {
  getUserInfo(): PromiseResponseBase<UserInfo> {
    return httpService.get(`${USER_URL}/get-user-info`);
  }

  updateUserInfo(body: RequestUpdateUserInfo) {
    return httpService.post(`${USER_URL}/update-user-info`, body);
  }

  assignUser(body: RequestAssignUser) {
    return httpService.post(`${USER_URL}/assign-user`, body);
  }

  unAssignUser(body: RequestAssignUser) {
    return httpService.post(`${USER_URL}/unassign-user`, body);
  }

  getListUser(
    body: RequestGetListUser
  ): PromiseResponseBase<ResponsePagingCommon<UserInfo[]>> {
    return httpService.get(
      `${USER_URL}/list-user?${queryString.stringify(body)}`
    );
  }

  getUserDetail({ username }: { username: string }) {
    return httpService.get(`${USER_URL}/get-user?username=${username}`);
  }

  updateUser(username: string, body: RequestUpdateUserInfo) {
    return httpService.post(
      `${USER_URL}/update-user?username=${username}`,
      body
    );
  }

  signOut(accessToken: string) {
    return httpService.post(`${USER_URL}/signout-global`, { accessToken });
  }

  loginWithCognito(tokenCognito: string, refreshTokenCognito?: string) {
    return httpService.post(`${AUTH_URL}/login-with-cognito`, {
      tokenCognito,
      refreshTokenCognito,
    });
  }

  profile() {
    return httpService.get(`${AUTH_URL}`);
  }

  upload(body: any) {
    const bodyUpload = new FormData();
    const binaryData = [];
    binaryData.push(body.file);
    const URL = new Blob(binaryData, { type: "image/png" });
    bodyUpload.append("file", URL);
    return httpService.post(`${UPLOAD}`, bodyUpload);
  }
}

export default new UserService();
