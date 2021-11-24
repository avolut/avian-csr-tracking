base(
  {
    meta: {},
    init: ({ meta, children }) => {
      if (
        window.user.role === "guest" &&
        window.location.pathname !== "/login"
      ) {
        return (window.location.href = "/login");
      } else if (
        window.user.role !== "guest" &&
        window.location.pathname === "/login"
      ) {
        return (window.location.href = "/");
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
