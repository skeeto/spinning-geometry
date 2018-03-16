const ROTATION_PERIOD    = 14; // seconds
const DOT_RADIUS         = 0.018;
const LINE_WIDTH         = 0.010;
const DOT_COLOR          = '#000';
const TRIANGLE_COLOR     = '#f44';
const TRIANGLE_PHASE     = Math.PI / 2; // radians
const TRIANGLE_FREQUENCY = 0.5;
const SQUARE_COLOR       = '#44f';
const SQUARE_PHASE       = 0; // radians
const SQUARE_FREQUENCY   = 0.5;
const STAR_COLOR         = '#fd4';
const STAR_PHASE         = 0; // radians
const STAR_FREQUENCY     = 0.25;
const MAJOR_RADIUS       = 0.57;
const MINOR_RADIUS       = 0.35;

window.addEventListener('DOMContentLoaded', function() {
    const MS  = 1000;
    const TAU = Math.PI * 2;

    let start = Date.now();
    let points = new Float64Array(24); // (x, y) pairs
    let ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
    let body = document.getElementsByTagName('body')[0];

    function step() {
        let period;
        let now = Date.now() - start;
        let phase = now * TAU / (ROTATION_PERIOD * MS);
        let angle = (now * TAU / (ROTATION_PERIOD * MS)) % TAU;
        let w = ctx.canvas.width = body.clientWidth;
        let h = ctx.canvas.height = body.clientHeight;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(Math.min(w, h) / 2, Math.min(w, h) / 2);
        ctx.lineWidth = LINE_WIDTH;
        ctx.lineJoin = 'bevel';

        /* Compute point positions */
        for (let t = 0; t < 4; t++) {
            let tangle = angle + TAU * t / 4;
            for (let c = 0; c < 3; c++) {
                let cangle = -angle - TAU * c / 3;
                let x = Math.cos(tangle) * MAJOR_RADIUS +
                    Math.cos(cangle) * MINOR_RADIUS;
                let y = Math.sin(tangle) * MAJOR_RADIUS +
                    Math.sin(cangle) * MINOR_RADIUS;
                let i = t * 6 + c * 2;
                points[i + 0] = x;
                points[i + 1] = y;
            }
        }

        /* Draw star */
        period = -Math.sin(STAR_PHASE + STAR_FREQUENCY * phase);
        ctx.globalAlpha = Math.pow(Math.max(period, 0), 0.5);
        ctx.strokeStyle = STAR_COLOR;
        let star_base = angle / 7;
        ctx.beginPath();
        ctx.moveTo(Math.cos(star_base), Math.sin(star_base));
        for (let i = 1; i < 8; i++) {
            let base = star_base + TAU * (i * 3 % 7) / 7;
            ctx.lineTo(Math.cos(base), Math.sin(base));
        }
        ctx.stroke();

        /* Draw triangles */
        period = -Math.sin(TRIANGLE_PHASE + TRIANGLE_FREQUENCY * phase);
        ctx.globalAlpha = Math.pow(Math.max(period, 0), 0.5);
        ctx.strokeStyle = TRIANGLE_COLOR;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(points[i * 6 + 0], points[i * 6 + 1]);
            ctx.lineTo(points[i * 6 + 2], points[i * 6 + 3]);
            ctx.lineTo(points[i * 6 + 4], points[i * 6 + 5]);
            ctx.lineTo(points[i * 6 + 0], points[i * 6 + 1]);
            ctx.stroke();
        }

        /* Draw squares */
        period = -Math.sin(SQUARE_PHASE + SQUARE_FREQUENCY * phase);
        ctx.globalAlpha = Math.pow(Math.max(period, 0), 0.5);
        ctx.strokeStyle = SQUARE_COLOR;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(points[i * 2 + 0], points[i * 2 + 1]);
            ctx.lineTo(points[i * 2 + 6], points[i * 2 + 7]);
            ctx.lineTo(points[i * 2 + 12], points[i * 2 + 13]);
            ctx.lineTo(points[i * 2 + 18], points[i * 2 + 19]);
            ctx.lineTo(points[i * 2 + 0], points[i * 2 + 1]);
            ctx.stroke();
        }

        /* Draw points */
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = DOT_COLOR;
        for (let i = 0; i < 12; i++) {
            let x = points[i * 2 + 0];
            let y = points[i * 2 + 1];
            ctx.beginPath();
            ctx.arc(x, y, DOT_RADIUS, 0, TAU);
            ctx.fill();
        }

        ctx.restore();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
});
