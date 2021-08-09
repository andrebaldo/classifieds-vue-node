export const routeMixins = {
  methods: {
    goToRoute(path) {

      let pathArray = this.$route.path.split('/');
      if (!pathArray.includes(path.replace("/", ""))) {
        this.$router.push(path);
      } else {
        if (path === "/" && this.$route.path !== path) {
          this.$router.push("/");
        }
      }
    },
    goToHome(){
      this.goToRoute('/');
    }
  }
};
