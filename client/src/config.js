// let BASE_URL = "url_if_u_host_the_project";
let BASE_URL = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:4000/";
}

export { BASE_URL };
