import {Element} from 'chart.js';
import {scaleValue} from '../helpers';

export default class PolygonAnnotation extends Element {
    inRange(x, y) {
        const {width, options} = this;
        const center = this.getCenterPoint(true);
        const radius = width / 2 + options.borderWidth;
        return true;
      }
    
      getCenterPoint(useFinalPosition) {
        const {x, y, x2, y2} = this.getProps(['x', 'y', 'x2', 'y2'], useFinalPosition);
        return {x: (x+x2) / 2, y: (y + y2) / 2};
      }
    
      draw(ctx) {
        const {points, options} = this;
    
        ctx.save();
    
        ctx.lineWidth = options.borderWidth;
        ctx.strokeStyle = options.borderColor;
        ctx.fillStyle = options.backgroundColor;
    
        ctx.setLineDash(options.borderDash);
        ctx.lineDashOffset = options.borderDashOffset;
    
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.fill();
        ctx.stroke();
    
        ctx.restore();
      }
    
      resolveElementProperties(chart, options) {
        const {scales} = chart;
        const xScale = scales[options.xScaleID];
        const yScale = scales[options.yScaleID];
        let x = options.xValue.length >= 1 ? Math.min(...options.xValue) : 0;
        let x2 = options.xValue.length >= 1 ? Math.max(...options.xValue) : 0;
        let y = options.yValue.length >= 1 ? Math.min(...options.yValue) : 0;
        let y2 = options.yValue.length >= 1 ? Math.max(...options.yValue) : 0;
        let points = undefined;
    
        if (!xScale || !yScale) {
          return {options: {}};
        }


        if (options.xValue.length !== options.yValue.length) {
            console.warn('X and Y arrays must be of the same length for a polygon annotation');
            return {options: {}};
        }

        points = options.xValue.map((val, i) => ({x: scaleValue(xScale, val, x), y: scaleValue(yScale, options.yValue[i], y)}));

        return {
            x,
            x2,
            y,
            y2,
            points
          };
      }
}

PolygonAnnotation.id = 'polygonAnnotation';

PolygonAnnotation.defaults = {
  display: true,
  adjustScaleRange: true,
  borderDash: [],
  borderDashOffset: 0,
  borderWidth: 1,
  radius: 10,
  xScaleID: 'x',
  xValue: undefined,
  yScaleID: 'y',
  yValue: undefined
};

PolygonAnnotation.defaultRoutes = {
  borderColor: 'color',
  backgroundColor: 'color'
};