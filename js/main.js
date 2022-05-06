document.addEventListener("DOMContentLoaded", function(event) {

  const showNavbar = (toggleId, navId, bodyId, headerId) =>{
  const toggle = document.getElementById(toggleId),
  nav = document.getElementById(navId),
  bodypd = document.getElementById(bodyId),
  headerpd = document.getElementById(headerId)
  
  if(toggle && nav && bodypd && headerpd){
  toggle.addEventListener('click', ()=>{
  nav.classList.toggle('show')
  toggle.classList.toggle('bx-x')
  bodypd.classList.toggle('body-pd')
  headerpd.classList.toggle('body-pd')
  })
  }
  }
  
  showNavbar('header-toggle','nav-bar','body-pd','header')
  
  const linkColor = document.querySelectorAll('.nav_link')
  
  function colorLink(){
  if(linkColor){
  linkColor.forEach(l=> l.classList.remove('active'))
  this.classList.add('active')
  }
  }
  linkColor.forEach(l=> l.addEventListener('click', colorLink))
  
  });

require(["esri/config", 
      "esri/Map", 
      "esri/core/watchUtils",
      "esri/views/SceneView", 
      "esri/widgets/Search",
      "esri/layers/FeatureLayer",
      "esri/widgets/LayerList",
      "esri/widgets/Legend",
      "esri/widgets/Locate",
      "esri/widgets/ElevationProfile",
      "esri/widgets/Editor",
      "esri/widgets/Expand"
     
], (
    esriConfig,
    Map,
    watchUtils,
    SceneView,
    Search,
    FeatureLayer,
    LayerList,
    Legend,
    Locate,
    ElevationProfile,
    Editor,
    Expand
  ) => {
    esriConfig.apiKey = "AAPKb29e41661651405794fa915d4e293e85WSXf3C_-tJ17VHDdZJaYuqWfbkbk0J-c17ad6R2jkV20QoeE3eqv99tL_Mj5H2Re";
      
    let pointLayer;

    const map = new Map({
      basemap: "arcgis-terrain",
      ground: "world-elevation"
    });
  
    const view = new SceneView({
      map: map,
      container: "viewDiv",
      zoom: 11,
      center: [-105.61, 40.33]
    });

    const legend = new Legend({
      view: view,
      container: document.createElement("div")
    });

    const expandLegend = new Expand({
      view: view,
      content: new Legend({
        view: view,
        container: document.createElement("div")
      })
    });

    const expandElevProfile = new Expand({
      view: view,
      content: new ElevationProfile({
        view: view,
        profiles: [
          {
            type: "ground"
          }
        ],
        visibleElements: {
          selectButton: false
        },
        // container: elev
      })
    });

    const pointInfos = {
      layer: pointLayer,
      formTemplate: {

        elements: [
          {
            type: "field",
            fieldName: "IncidentType",
            label: "Incident Type"
          },
          {
            type: "field",
            fieldName: "Date",
            label: "Date"
          },
          {
            type: "field",
            fieldName: "Description",
            label: "Description"
          }
        ]
      }
    }

    const expandEditor = new Expand({
      view: view,
      content: new Editor({
        view: view,
        layerInfos: [pointInfos]
      }),
      container: document.createElement("div")
    });

    // Breakpoints
    watchUtils.init(view, "widthBreakpoint", function(breakpoint) {
      switch (breakpoint) {
        case "xsmall":
          setViewResponsive(true);
          break;
        case "small":
        case "medium":
        case "large":
        case "xlarge":
          setViewResponsive(false);
          break;
        default:
      }
    });

    function setViewResponsive(isMobile) {
      // setTitleMobile(isMobile);
      setLegendMobile(isMobile);
      setElevProfMobile(isMobile);
    }

    // function setTitleMobile(isMobile) {
    //   var header = document.getElementsByClassName("header")[0];

    //   if (isMobile) {
    //     header.classList.add("invisible");
    //     view.padding = { top: 0 };
    //   } else {
    //     header.classList.remove("invisible");
    //     view.padding = { top: 55 };
    //   }
    // }

    function setLegendMobile(isMobile) {
      var toRemove = isMobile ? legend : expandLegend;
      var toAdd = isMobile ? expandLegend : legend;

      view.ui.remove(toRemove);
      view.ui.add(toAdd, "bottom-right");
    }

    function setElevProfMobile(isMobile) {

    }

    // geolocator button widget
    const locateBtn = new Locate({
      view: view
    });

    view.ui.add(locateBtn, {
      position: "top-left"
    });

    view.ui.add(expandElevProfile, "top-left");
    view.ui.add(expandEditor, "top-left");

    const popupPermitOffice = {
      title: "<b>Wilderness Permit Office</b>",
      content: "{Struct_Nam}"
    }

    const popupTrailhead = {
      title: "<b>{POITYPE}</b>",
      content: "Name: {POINAME}"
    }

    const popupTrails = {
      title: "<b>{TRLNAME}</b>",
      content: "<ul><li>Trail Use: {TRLUSE} <li>Description: {FMSSINFO} <li>Length: {Lngth_Mile} mi"
    }

    const popupCampsite = {
      title: "<b>Backcountry Campsite</b>",
      content: "<ul><li>Name: {Campsite} <li>Group Site: {GroupSite}</ul>"
    }

    const trailheadRenderer = {
      type: "simple",
      symbol: {
        type: "picture-marker",
        url: "img/sign.png",
        width: "20px",
        height: "20px"
      }
    }

    const boundary = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Park_Boundary/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-line",
          color: "black",
          width: 2
        }
      }
    });

    const roads = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Park_Roads/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
            color: "#686868",
            type: "simple-line",
            width: 2
        }
      }
    });

    const trails = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Rocky_Mountain_National_Park___Trails/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-line",
          color: "#AE431E",
          width: 1.5
        }
      },
      popupTemplate: popupTrails
    });

    const trailheads = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Trailheads_/FeatureServer",
      renderer: trailheadRenderer,
      popupTemplate: popupTrailhead
    });

    const campsites = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Backcountry_Campsites_2017/FeatureServer",
      renderer: {
        type: "simple",
        symbol: {
          type: "picture-marker",
          url: "img/tent.png",
          width: "20px",
          height: "20px"
        }
      },
      popupTemplate: popupCampsite
    });

    const incidentRenderer = {
      type: "unique-value",
      field: "IncidentTy",
      uniqueValueInfos: [{
        value: "Wildlife encounter",
        symbol: {
          type: "picture-marker",
          url: "img/paw.png",
          width: "18px",
          height: "18px"
        }
      }, {
        value: "Avalanche",
        symbol: {
          type: "picture-marker",
          url: "img/avalanche.png",
          width: "18px",
          height: "18px"
        }
      }, {
        value: "Lightning strike",
        symbol: {
          type: "picture-marker",
          url: "img/flash.png",
          width: "18px",
          height: "18px"
        }
      }, {
        value: "River rescue",
        symbol: {
          type: "picture-marker",
          url: "img/rescue.png",
          width: "18px",
          height: "18px"
        }
      },{
        value: "Other",
        symbol: {
          type: "picture-marker",
          url: "img/warning.png",
          width: "18px",
          height: "18px"
        }
      }]
    };
    // <a href="https://www.flaticon.com/free-icons/bear" title="bear icons">Bear icons created by Freepik - Flaticon</a>
    // <a href="https://www.flaticon.com/free-icons/thunder" title="thunder icons">Thunder icons created by Roundicons Premium - Flaticon</a>
    // <a href="https://www.flaticon.com/free-icons/avalanche" title="avalanche icons">Avalanche icons created by Vitaly Gorbachev - Flaticon</a>
    // <a href="https://www.flaticon.com/free-icons/rescue" title="rescue icons">Rescue icons created by Smashicons - Flaticon</a>

    const incidents = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Safety_Incidents/FeatureServer",
      renderer: incidentRenderer,
      popupTemplate: {
        title: "<b>{IncidentTy}</b>",
        content: "<ul><li>Date: {Date} <li>Description: {Descriptio}"
      }
    });

    const campsiteSearch = new Search({
      view: view,
      sources: [{
        layer: campsites,
        searchFields: ['Campsite'],
        suggestionTemplate: "Site name: {Campsite}",
        exactMatch: false,
        outfields: ['Campsite'],
        placeholder: 'Enter campsite name:'
      },
      {
        layer: trailheads,
        searchFields: ['POINAME'],
        exactMatch: false,
        outFields: ['POINAME'],
        placeholder: 'Enter starting area:',
        zoomScale: 2000
      }],
      includeDefaultSources: false,
      suggestionsEnabled: true,
      locationEnabled: false,
      allPlaceholder: "Campsite or trailhead:"
    });

    view.ui.add(campsiteSearch, "top-right");

    const permitOffices = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Permit_Offices/FeatureServer",
      renderer: {
        type: "simple", 
        symbol: {
          type: "picture-marker",
          url: "img/permit.png",
          width: "25px",
          height: "25px"
        }
      },
      popupTemplate: popupPermitOffice
    });

    map.addMany([boundary, roads, trails, trailheads, campsites, permitOffices, incidents]);

      const layerList = new LayerList({
        view: view,
        container: layers
      });
      // view.ui.add(layerList, "#layers");

  });