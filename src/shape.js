const SHAPE_LIST = {
    "rect": {
        viewBox: 200,
        path: "M 0 0 L 200 0 L 200 200 L 0 200 Z"
    },
    "roundRect": {
        viewBox: 200,
        path: "M 20 0 L 180 0 Q 200 0 200 20 L 200 180 Q 200 200 180 200 L 20 200 Q 0 200 0 180 L 0 20 Q 0 0 20 0 Z"
    },
    "snip1Rect": {
        viewBox: 200,
        path: "M 0 200 L 0 0 L 150 0 L 200 50 L 200 200 L 0 200"
    },
    "snip2SameRect": {
        viewBox: 200,
        path: "M 0 50 L 50 0 L 150 0 L 200 50 L 200 200 L 0 200 L 0 50 Z"
    },
    "snip2DiagRect": {
        viewBox: 200,
        path: "M 0 150 L 0 0 L 150 0 L 200 50 L 200 200 L 50 200 L 0 150 Z"
    },
    "round1Rect": {
        viewBox: 200,
        path: "M 0 0 L 140 0 Q 200 0 200 60 L 200 200 L 0 200 L 0 0 Z"
    },
    "round2SameRect": {
        viewBox: 200,
        path: "M 0 50 Q 0 0 50 0 L 150 0 Q 200 0 200 50 L 200 200 L 0 200 L 0 50 Z"
    },
    "round2DiagRect": {
        viewBox: 200,
        path: "M 0 50 Q 0 0 50 0 L 200 0 L 200 150 Q 200 200 150 200 L 0 200 L 0 0 Z"
    },
    "snipRoundRect": {
        viewBox: 200,
        path: "M 0 50 Q 0 0 50 0 L 0 0 L 150 0 L 200 50 L 200 200 L 0 200"
    },
    "ellipse": {
        viewBox: 200,
        path: "M 100 0 A 50 50 0 1 1 100 200 A 50 50 0 1 1 100 0 Z"
    },
    "triangle": {
        viewBox: 200,
        path: "M 100 0 L 0 200 L 200 200 L 100 0 Z"
    },
    "rtTriangle": {
        viewBox: 200,
        path: "M 0 0 L 0 200 L 200 200 Z"
    },
    "parallelogram": {
        viewBox: 200,
        path: "M 50 0 L 200 0 L 150 200 L 0 200 L 50 0 Z"
    },
    "trapezoid": {
        viewBox: 200,
        path: "M 50 0 L 150 0 L 200 200 L 0 200 L 50 0 Z"
    },
    "diamond": {
        viewBox: 200,
        path: "M 100 0 L 0 100 L 100 200 L 200 100 L 100 0 Z"
    },
    "pentagon": {
        viewBox: 200,
        path: "M 100 0 L 0 90 L 50 200 L 150 200 L 200 90 L 100 0 Z"
    },
    "hexagon": {
        viewBox: 200,
        path: "M 60 0 L 0 100 L 60 200 L 140 200 L 200 100 L 140 0 Z"
    },
    "pie": {
        viewBox: 200,
        path: "M 100 0 A 100 100 102 1 0 200 100 L 100 100 L 100 0 Z"
    },
    "chord": {
        viewBox: 200,
        path: "M 100 0 A 100 100 102 1 0 200 100 L 100 0 Z"
    },
    "teardrop": {
        viewBox: 200,
        path: "M 100 0 A 100 100 102 1 0 200 100 L 200 0 L 100 0 Z"
    },
    "frame": {
        viewBox: 200,
        path: "M0 0 L200 0 L200 200 L0 200 L0 0 Z M50 50 L50 150 L150 150 L150 50 Z"
    },
    "donut": {
        viewBox: 200,
        path: "M0 100 A100 100 0 1 1 0 101 Z M150 100 A50 50 0 1 0 150 101 Z"
    },
    "octagon": {
        viewBox: 200,
        path: "M 60 0 L 140 0 L 200 60 L 200 140 L 140 200 L 60 200 L 0 140 L 0 60 L 60 0 Z"
    },
    "dodecagon": {
        viewBox: 200,
        path:  "M 75 0 L 125 0 L 175 25 L 200 75 L 200 125 L 175 175 L 125 200 L 75 200 L 25 175 L 0 125 L 0 75 L 25 25 L 75 0 Z"
    },
    "diagStripe": {
        viewBox: 200,
        path: "M 200 0 L 100 0 L 0 100 L 0 200 L 200 0 Z"
    },
    "plus": {
        viewBox: 200,
        path: "M 50 0 L 150 0 L 150 50 L 200 50 L 200 150 L 150 150 L 150 200 L 50 200 L 50 150 L 0 150 L 0 50 L 50 50 L 50 0 Z"
    },
    "mathPlus": {
        viewBox: 200,
        path: "M 70 0 L 70 70 L 0 70 L 0 130 L 70 130 L 70 200 L 130 200 L 130 130 L 200 130 L 200 70 L 130 70 L 130 0 L 70 0 Z"
    },
    "mathMultiply": {
        viewBox: 200,
        path: "M 40 0 L 0 40 L 60 100 L 0 160 L 40 200 L 100 140 L 160 200 L 200 160 L 140 100 L 200 40 L 160 0 L 100 60 L 40 0 Z"
    },
    "wedgeRectCallout": {
        viewBox: 200,
        path: "M 0 0 L 200 0 L 200 200 L 100 200 L 60 240 L 60 200 L 0 200 L 0 0 Z"
    },
    "rightArrow": {
        viewBox: 200,
        path: "M 200 100 L 100 0 L 100 50 L 0 50 L 0 150 L 100 150 L 100 200 L 200 100 Z"
    },
    "leftArrow": {
        viewBox: 200,
        path: "M 0 100 L 100 0 L 100 50 L 200 50 L 200 150 L 100 150 L 100 200 L 0 100 Z"
    },
    "upArrow": {
        viewBox: 200,
        path: "M 100 0 L 0 100 L 50 100 L 50 200 L 150 200 L 150 100 L 200 100 L 100 0 Z"
    },
    "downArrow": {
        viewBox: 200,
        path: "M 100 200 L 200 100 L 150 100 L 150 0 L 50 0 L 50 100 L 0 100 L 100 200 Z"
    },
    "leftRightArrow": {
        viewBox: 200,
        path: "M 0 100 L 60 0 L 60 60 L 140 60 L 140 0 L 200 100 L 140 200 L 140 140 L 60 140 L 60 200 L 0 100 Z"
    },
    "upDownArrow": {
        viewBox: 200,
        path: "M 100 0 L 0 60 L 60 60 L 60 140 L 0 140 L 100 200 L 200 140 L 140 140 L 140 60 L 200 60 L 100 0 Z"
    },
    "straightConnector1": {
        path: "M 0 0 L 20 20"
    },
    "line": {
        path: "M 0 0 L 20 20"
    }
};

module.exports = { SHAPE_LIST };
