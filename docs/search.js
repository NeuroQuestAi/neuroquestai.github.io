// <stdin>
(function() {
  let $ = document.querySelector.bind(document);
  const { algoliaConfig } = window;
  if (!algoliaConfig) {
    throw new Error("Algolia config not found, needs addition in product toml config");
  }
  let {
    apikey: apiKey,
    product,
    index: indexName
  } = algoliaConfig;
  const facetFilters = product ? [`product:${product}`] : [];
  function loaded() {
    window.docsearch({
      indexName,
      appId: "G2QATEF3L4",
      apiKey,
      container: "#algolia",
      maxResultsPerGroup: 20,
      insights: true,
      searchParameters: {
        optionalFilters: facetFilters
      },
      transformItems: (items) => {
        return items.filter((item) => {
          const url = new URL(item.url);
          return url.pathname.endsWith("/");
        });
      }
    });
    let button = $("#MobileSearch");
    if (button) {
      button.addEventListener("click", () => {
        document.querySelector(".DocSearch.DocSearch-Button").click();
      });
    }
  }
  (function check() {
    if (!indexName || !apiKey)
      return;
    if (window.docsearch)
      loaded();
    else
      setTimeout(check, 25);
  })();
})();
