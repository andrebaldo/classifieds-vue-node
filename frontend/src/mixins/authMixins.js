export const authMixins = {
  methods: {
    getIsUserLogged() {
      if (localStorage.loginToken) {
        return true;
      }
      return false;
    }
  }
}
