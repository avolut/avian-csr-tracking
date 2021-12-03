base(
  {
    meta: {
      titleHeader: "-",
      open: false,
    },
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
      } else if (window.user.role !== "guest" && window.location.pathname !== "/") {
        const roles = {
          hrd: ["/admin/dashboard", "/admin/csr", "/changePassword"],
          director: ["/admin/dashboard", "/admin/summary-report", "admin/lacak-csr", "/changePassword"]
        }
        if (window.user.role === "hrd") {
          if (roles.hrd.findIndex(x => window.location.pathname.match(x)) < 0) return (window.location.href = "/");
        }

        if (window.user.role === "director") {
          if (roles.director.findIndex(x => window.location.pathname.match(x)) < 0) return (window.location.href = "/");
        }
      }


      const titleHeader = {
        "/admin/dashboard": "Dashboard",
        "/admin/csr": "CSR",
        "/admin/summary-report": "Summary Report",
        "/admin/setting-target": "Setting Target",
        "/admin/lacak-csr": "Lacak CSR",
        "/admin/master-data-kegiatan": "Kegiatan CSR",
        "/admin/master-data-supplier": "Supplier",
        "/admin/master-data-area": "Area Tirta",
        "/admin/master-data-cabang": "Cabang",
        "/admin/master-data-covered-area": "Covered Area",
        "/admin/master-data-jenis-instansi": "Jenis Instansi",
        "/admin/master-data-jenis-bantuan": "Jenis Bantuan",
        "/admin/master-data-instansi-penerima": "Instansi Penerima",
        "/admin/master-data-jenis-instanis": "Jenis Instansi",
      };

      runInAction(() => {
        const f = Object.keys(titleHeader).find(
          (x) => window.location.pathname.indexOf(x) >= 0
        );
        meta.titleHeader = titleHeader[f] || "-";
      });
    },
  },
  ({ meta, children }) => (
    <div class={`bg-white flex flex-1`}>
      <w-sidebar role={window.user.role} />
      <div class="flex flex-1 self-stretch flex-col items-start justify-start bg-white">
        <div
          class={`flex self-stretch flex-col items-start justify-start`}
        >
          <w-topbar
            title={meta.titleHeader}
            open={meta.open}
            onClickOpen={() => {
              runInAction(() => {
                meta.open = !meta.open;
              });
            }}
          />
        </div>
        <div
          class="flex-1 flex items-stretch self-stretch relative"
          style="> div { flex:1 }"
        >
          {children}
        </div>
      </div>
    </div>
  )
);

// ga geeremet2 wkwkw