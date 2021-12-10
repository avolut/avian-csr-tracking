base(
  {
    meta: {
    },
    init: ({ meta }) => {
      const user = (window as any).user
      if (
        user.role === "guest" &&
        window.location.pathname !== "/login"
      ) {
        return (window.location.href = "/login");
      } else if (
        user.role !== "guest" &&
        window.location.pathname === "/login"
      ) {
        return (window.location.href = "/");
      } else if (user.role !== "guest" && window.location.pathname !== "/") {
        const roles = {
          hrd: ["/admin/dashboard", "/admin/csr", "/changePassword"],
          director: ["/admin/dashboard", "/admin/summary-report", "admin/lacak-csr", "/changePassword"]
        }
        if (user.role === "hrd") {
          if (roles.hrd.findIndex(x => window.location.pathname.match(x)) < 0) return (window.location.href = "/");
        }

        if (user.role === "director") {
          if (roles.director.findIndex(x => window.location.pathname.match(x)) < 0) return (window.location.href = "/");
        }
      }
    },
  },
  ({ meta, children }) => (
    <>
      <>
        <div class={`bg-white flex flex-1 overflow-hidden`}>{children}</div>
      </>
    </>
  )
);
