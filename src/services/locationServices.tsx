import BaseUrl from "../consts/baseUrl";

class LocationService {
  initialPathname: string;
  constructor() {
    this.initialPathname = "";
  }

  setInitialPathname() {
    if (
      window.location.pathname === BaseUrl.Logout ||
      window.location.pathname === BaseUrl.Login
    ) {
      this.initialPathname = BaseUrl.Homepage;
      return;
    }

    this.initialPathname = window.location.pathname;
  }
}

export default new LocationService();
