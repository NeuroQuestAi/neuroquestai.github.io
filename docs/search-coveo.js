"use strict";
(() => {
  // <stdin>
  (function() {
    let tag = document.currentScript;
    let $ = document.querySelector.bind(document);
    const currentLocation = window.location.href;
    const paramRegex = new RegExp("/search/#(.+)");
    const result = currentLocation.match(paramRegex);
    let productGroup = "";
    if (result) {
      const params = new URLSearchParams(result[1]);
      productGroup = params.get("product_group") || "";
    }
    let coveo;
    let dataset = tag && tag.dataset;
    let { org, token } = dataset || {};
    function setReferrerValue() {
      const referrer = document.referrer.match("(?:docs.neuroquest.ai|neuroquest-docs-7ou.pages.dev)(/.+?/)");
      if (referrer !== null) {
        return referrer[1];
      }
    }
    function getProductGroupValue() {
      return productGroup;
    }
    function loadCustomSearchBox() {
      let element = $("#DocsSearch--input") || $("#SiteSearch--input");
      const CustomSearchbox = function(_super) {
        __extends(CustomSearchbox2, coveo.Component);
        function CustomSearchbox2(element2, options, bindings) {
          _super.call(this, element2, CustomSearchbox2.ID, bindings);
          this.type = "CustomSearchBox";
          coveo.Component.bindComponentToElement(element2, this);
          this.element = element2;
          this.options = coveo.ComponentOptions.initComponentOptions(element2, CustomSearchbox2, options);
          this.bindings = bindings;
          this.element.addEventListener("keyup", (e) => this.handleKeyUp(e));
        }
        CustomSearchbox2.prototype.handleKeyUp = function(e) {
          if (this.options.searchAsYouType) {
            this.executeNewQuery();
          } else if (e.key == "Enter") {
            this.executeNewQuery();
          }
        };
        CustomSearchbox2.prototype.executeNewQuery = function() {
          this.bindings.queryStateModel.set("q", this.element.value);
          this.bindings.queryController.executeQuery();
        };
        CustomSearchbox2.options = {
          searchAsYouType: coveo.ComponentOptions.buildBooleanOption({ defaultValue: false })
        };
        CustomSearchbox2.ID = "CustomSearchBox";
        coveo.Initialization.registerAutoCreateComponent(CustomSearchbox2);
      }(coveo.Component);
      coveo.SearchEndpoint.configureCloudV2Endpoint(org, token);
      coveo.initSearchbox($(".CoveoSearchInterface"), "/search");
      addEventListener("keydown", (ev) => {
        if (ev.target === element)
          return;
        let key = ev.which;
        if (key === 191 || ev.shiftKey && key === 83) {
          ev.preventDefault();
          window.scrollTo(0, 0);
          element.focus();
        }
      });
    }
    function loadSearchResults() {
      coveo.SearchEndpoint.configureCloudV2Endpoint(org, token);
      const root = document.getElementById("searchresults");
      coveo.init(root);
      coveo.$$(root).on("afterInitialization", (e, args) => {
        let pipelineContext = coveo.$$(root).find(".CoveoPipelineContext");
        pipelineContext = coveo.get(pipelineContext);
        pipelineContext.setContextValue("referrer", setReferrerValue());
        pipelineContext.setContextValue("product_group", getProductGroupValue());
      });
      coveo.$$(root).on("changeAnalyticsCustomData", (e, args) => {
        if (args.type === "ClickEvent" || args.type === "CustomEvent") {
          args.metaObject.context_referrer = setReferrerValue();
          args.metaObject.context_product_group = getProductGroupValue();
        }
      });
      function showLoadingToggle(bool) {
        const search = document.querySelector("span.coveo-search-button");
        const loading = document.querySelector("span.coveo-search-button-loading");
        search.style.display = bool ? "none" : "";
        loading.style.display = bool ? "" : "none";
      }
      coveo.$$(root).on("newQuery", () => showLoadingToggle(true));
      coveo.$$(root).on("newResultsDisplayed", () => showLoadingToggle(false));
    }
    (function check() {
      if (!org || !token)
        return;
      if (coveo = window.Coveo) {
        location.pathname.startsWith("/search") ? loadSearchResults() : loadCustomSearchBox();
      } else {
        setTimeout(check, 25);
      }
    })();
  })();
})();
