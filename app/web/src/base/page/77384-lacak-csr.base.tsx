base(
  {
    meta: () => {
      const meta = {
        loading: true,
        reports: [] as any[],
        METABASE_SITE_URL: "",
      };
      return meta;
    },
    init: ({ meta }) => {
      const _init = async () => {
        const config = await db.m_config.findFirst({
          where: {
            type: "METABASE_SITE_URL",
          },
        });
        const metabases = await db.m_metabase.findMany({
          where: {
            type: "lacak-csr",
          },
        });
        const _metabases: any[] = [];
        await globalVar.asyncForEach(metabases, async (m) => {
          const credential = await api("/api/login-metabase", {
            resource: m.resource,
            params: {},
          });
          const iframeUrl =
            config.value +
            "/embed/dashboard/" +
            credential.token +
            "#bordered=true&titled=true";

          _metabases.push({ ...m, iframeUrl });
        });
        meta.reports = _metabases;
        meta.loading = false;
      };

      _init();
    },
  },
  ({ meta }) => (
    <div className="flex flex-1">
      {meta.loading ? (
        <loading />
      ) : (
        <pure-tab
          tabs={meta.reports
            .map((el: any, idx) => {
              return {
                title: el.title,
                component: () => (
                  <iframe className="w-full" key={idx} src={el.iframeUrl} sandbox="allow-forms allow-downloads allow-scripts allow-same-origin allow-popups"/>
                ),
              };
            })
            .filter((e) => !!e.title)}
          position={"top"}
        />
      )}
    </div>
  )
);
