require([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Bookmarks",
  "esri/widgets/BasemapGallery",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/Slice",
  "esri/widgets/Weather",
  "esri/widgets/DirectLineMeasurement3D",
  "esri/widgets/AreaMeasurement3D",
  "esri/widgets/Search",
  "esri/widgets/ShadowCast",
  "esri/widgets/Daylight",
  "esri/widgets/ElevationProfile",
  "esri/widgets/LineOfSight",
  "esri/widgets/HistogramRangeSlider",
  "esri/smartMapping/statistics/histogram",
  "esri/core/promiseUtils"
], function(WebScene, SceneView, Bookmarks, BasemapGallery, LayerList, Legend, Slice,
   Weather, DirectLineMeasurement3D, AreaMeasurement3D, Search, ShadowCast, Daylight, 
   ElevationProfile, LineOfSight, HistogramRangeSlider, histogram, promiseUtils) {
  const websceneId = 'cac6143eca14471ebc1b90ea29b827c6'

  const webscene = new WebScene({
    portalItem: {
      id: websceneId
    }
  });

  const view = new SceneView({
    map: webscene,
    container: "viewDiv",
    padding: {
      left: 49
    }
  });

  view.ui.move("zoom", "top-left");

  const basemaps = new BasemapGallery({
    view,
    container: "basemaps-container"
  });

  const options = {
    takeScreenshot: false,
    captureViewpoint: true
  };

  const bookmarks = new Bookmarks({
    view,
    editingEnabled: true,
    defaultCreateOptions: {
      takeScreenshot: true,
      captureViewpoint: true,
      captureTimeExtent: false, // the time extent of the view will not be saved in the bookmark
      screenshotSettings: {
        width: 100,
        height: 100
      }
    },
    container: "bookmarks-container"
  });

  const layerList = new LayerList({
    view,
    selectionEnabled: true,
    container: "layers-container"
  });

  const legend = new Legend({
    view,
    container: "legend-container"
  });

  const slice = new Slice({
    view,
    container: "slice-container"
  });
  
  const weather = new Weather({
    view,
    container: "weather-container"
  });

  const directLineMeasurement3D = new DirectLineMeasurement3D({
    view,
    container: "directLineMeasurement3D-container"
  });

  const areaMeasurement3D = new AreaMeasurement3D({
    view,
    container: "areaMeasurement3D-container"
  });

  const searchWidget = new Search({
    view,
  });
  view.ui.add(searchWidget, {
    position: "top-right",
    index: 2
  });

  const shadowCast = new ShadowCast({
    view,
    container: 'shadowCast-container',
  });

  const daylight = new Daylight({
    view,
    container: 'daylight-container',
    dateOrSeason: "season"
  });

  const elevationProfile = new ElevationProfile({
    view: view,
    container: 'elevationProfile-container',
  });
  
  const lineOfSight = new LineOfSight({
    view: view,
    container: 'lineOfSight-container'
  });

  webscene.when(() => {
    const { title, description, thumbnailUrl, avgRating } = webscene.portalItem;
    document.querySelector("#header-title").textContent = title;
    document.querySelector("#item-description").innerHTML = description;
    document.querySelector("#item-thumbnail").src = thumbnailUrl;
    document.querySelector("#item-rating").value = avgRating;
    
    // component interaction
    let activeWidget;

    const handleActionBarClick = ({ target }) => {
      // no exist, exit
      if (target.tagName !== "CALCITE-ACTION") {
        return;
      }
      // hidden component and panel
      if (activeWidget) {
        document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
        document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
      }
      // show component and panel
      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
        document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
        document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
        activeWidget = nextWidget;
      } else {
        activeWidget = null;
      }
    };

    // Listen calcite-action-bar
    document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

    // adjust view
    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", event => {
      actionBarExpanded = !actionBarExpanded;
      view.padding = {
        left: actionBarExpanded ? 45 : 135,
        right: actionBarExpanded ? 45 : 135
      };
    });

    document.querySelector("calcite-shell").hidden = false;
    document.querySelector("calcite-loader").hidden = true;

  });
});