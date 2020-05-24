
/**
 * @author zsp
 * @date 2020/5/20 9:32
 * @description 主文件
 */

window. points = [];// 点集合
window. polArr = [];// 多变形点集合
window.linesTem = {};
window. linesStart = {};
window. drawType = '';
window.ply=null

/**
 * @description 覆盖物类型静态类
 * @example LayersType.POINT
 */
function LayersType() { };
LayersType.POINT = 1;
LayersType.PLY = 2;

/**
 * @description 获取在多边形内的点
 * @example getPointInPly()
 */
function getPointInPly() {
    if(!ply){
        return
    }
    console.clear();
    console.log("区域内的点");
    for(let i =0;i<points.length;i++){

        if(pointInPly(ply,points[i])){
            console.log(points[i].geometry.longitude,points[i].geometry.latitude);
            setTimeout(function(){
                drawPoint(window.view,points[i].geometry,'#000')
            },0)
        }
    }
    console.log("end");

}

/**
 *
 * @param {Number} type  图形类别
 */
function setDrawType(type) {
    linesStart={}
    window.drawType = type;
}
function clearOverviews(){
    window.location.reload()
}

/**
 *
 * @param {View} view
 * @param {Point} poi
 * @param {RGB} color
 */
function drawPoint(view, poi,color=[226, 119, 40]) {

    var point = {
        type: "point",
        latitude: poi.latitude,
        longitude: poi.longitude
    };
    var simpleMarkerSymbol = {
        type: "simple-marker",
        color: color,
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    };
    var pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
    });
    points.push(pointGraphic);
    view.graphics.add(pointGraphic)
};


function drawLine(view, poi, e) {
    var simpleLineSymbol = {
        type: "simple-line",
        color: [226, 119, 40],
        width: 2
    };
    if (linesTem.geometry) {
        view.graphics.remove(linesTem)
    } else {
        linesTem.geometry = {};
        linesTem.geometry.paths = []
        linesTem.geometry.paths[0] = []
    }
    linesTem.geometry.paths[0].push([poi.longitude, poi.latitude])
    var polyline = {
        type: "polyline",
        paths: linesTem.geometry.paths[0]
    };
    var polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: simpleLineSymbol
    })
    linesTem = polylineGraphic;
    view.graphics.add(polylineGraphic)
    if (!linesStart.x) {
        linesStart = e;
    }else{
        if(Math.abs(e.x-linesStart.x)<5&&Math.abs(e.y-linesStart.y)<5){
            drawPly(view);
        }
    }
}

function pointInPly(ply,point){
    var c=  isInPolygon([point.geometry.longitude,point.geometry.latitude],ply.geometry.rings[0])

    // var intersects = geometryEngine.intersects(ply.geometry, point.geometry) // arcgis 报错
    return c
}

/**
 *
 * @param {*} view
 */
function drawPly(view){
    var polygon = {
        type: "polygon",
        rings: linesTem.geometry.paths[0]
    };

    var simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8],  // orange, opacity 80%
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    };

    var polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol
    });
    view.graphics.remove(linesTem)
    view.graphics.add(polygonGraphic)
    ply=polygonGraphic;
    linesStart={};
}

/**
 * @description 入口函数
 * @example  main{notifyLoader()}
 */
export  default function notifyLoader(Map, MapView, Graphic, geometryEngine ) {
    window.Graphic = Graphic;
    window.geometryEngine  =geometryEngine
    var map = new Map({
        basemap: "streets-navigation-vector"
    });
    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [116.20, 39.56],
        zoom: 11
    });
    window.view = view;
    document.getElementById('one1').addEventListener('click',function  (){
        setDrawType(LayersType.POINT)
    })
    document.getElementById('one2').addEventListener('click',function  (){
        setDrawType(LayersType.PLY)
    })
    document.getElementById('one3').addEventListener('click',function  (){
        getPointInPly()
    })
    document.getElementById('one4').addEventListener('click',function  (){
        clearOverviews()
    })
    view.on('click', function (e) {
        if (drawType === LayersType.POINT) {
            drawPoint(view, e.mapPoint)
        } else if (drawType === LayersType.PLY) {
            drawLine(view, e.mapPoint, e)
        }
    })
}





function isInPolygon(checkPoint, polygonPoints) {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
            checkPoint[0] > Math.min(p1[0], p2[0]) &&
            checkPoint[0] <= Math.max(p1[0], p2[0])
        ) {
            if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                if (p1[0] != p2[0]) {
                    xinters =
                        (checkPoint[0] - p1[0]) *
                        (p2[1] - p1[1]) /
                        (p2[0] - p1[0]) +
                        p1[1];
                    if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                        counter++;
                    }
                }
            }
        }
        p1 = p2;
    }
    if (counter % 2 == 0) {
        return false;
    } else {
        return true;
    }
}
