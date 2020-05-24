<template>
 <div>
   <div id="viewDiv" style="width: 100vw;height: 100vh">
   </div>
   <div id='op' style=" position: absolute;
            right: 0;
            top: 0;">
     <button id="one1" >画点</button>
     <button id="one2" >画多变形</button>
     <button id="one3" >标识区域内的点</button>
     <button id="one4" >清除</button>
   </div>
 </div>
</template>

<script>
  import { loadModules } from 'esri-loader';
  import notifyLoader from "./utils";
export default {
  name: 'Home',
  components: {

  },
  mounted() {
    this.createDom();
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/geometry/geometryEngine"
    ], { css: true })
            .then(([Map, MapView, Graphic, geometryEngine]) => {
              notifyLoader(Map, MapView, Graphic, geometryEngine)
              // console.log(map);
              // const map = new Map({
              //   basemap: 'topo-vector'
              // });
              //
              // this.view = new MapView({
              //   container: 'viewDiv',
              //   map: map,
              //   center: [-118, 34],
              //   zoom: 8
              // });
            });
  },
  methods:{
    createDom(){

    }
  }
}
</script>
