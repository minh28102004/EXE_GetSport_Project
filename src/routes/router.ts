const endPoint = {
  HOMEPAGE: "/",
  AUTH: "/auth",
  LOGIN: "/auth?view=login",
  REGISTER: "/auth?view=register",
  FORGOTPASSWORD: "auth?view=forgotpass",
  BLOGPOST: "/blogPost",
  ABOUT: "/about",
  FAQS: "/faqs",
  COURTBOOKING: "/booking",
  LOCATIONS: "/locations",
  CONTACT: "/contact",
  DASHBOARDLAYOUT: "/dashboard",
  UNAUTHORIZEDPAGE: "/unauthorizedpage",
  TERMSOFSERVICE: "/termsofservice",
  PRIVACYPOLICY: "/privacypolicy",
  ACCESSDENIED: "/access-denied",
  //  User area (nested)
  CUSTOMER_BASE: "/customerlayout", 
  CUSTOMER_PROFILE: "profile", 
  CUSTOMER_HISTORY: "history",
  CUSTOMER_POSTS: "posts",
  CUSTOMER_REVIEWS: "reviews",
};

export default endPoint;
