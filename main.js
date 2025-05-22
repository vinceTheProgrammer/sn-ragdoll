/// <reference path="./types/matter.d.ts" />

import init, { Stickfigure, NodeType, Color } from "./sticknodes-js/sticknodes_js_web.js";
init().then(() => {
    console.log("sticknodes-js wasm initialized.");
    // Initial ragdoll
    loadDefaultRagdoll(300, 300);
})

// @ts-ignore
const { Engine, Render, Runner, World, Bodies, Body, Constraint, Mouse, MouseConstraint, Vector, Events, Composite } = Matter;

const engine = Engine.create();
const { world } = engine;
//engine.gravity.y = 0;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: '#f0f0f0'
    },
});

Render.run(render);
Runner.run(Runner.create(), engine);

const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 25, window.innerWidth, 50, { isStatic: true });
World.add(world, ground);

Events.on(engine, 'beforeUpdate', obj => {
    const constraints = obj.source.world.constraints

    // Example: loop through and do something with each body
    for (const constraint of constraints) {

        const child = constraint.bodyA;
        const parent = constraint.bodyB;

        if (!child || !parent) continue;

        const angle = clampAngleThetaTo2Pi(getRelativeAngle(child, parent));
        const minAngle = -Math.PI / 2; // adjust this
        const maxAngle = 0;            // adjust this
    
        if (angle < minAngle) {
            const magnitude = Math.abs(minAngle - angle);
            Body.rotate(child, 0.001 * magnitude );
            //Body.setAngularVelocity(child, child.angularVelocity / 2);
        } else if (angle > maxAngle) {
            const magnitude = Math.abs(maxAngle + angle);
            Body.rotate(child, -0.001 * magnitude);
            //Body.setAngularVelocity(child, child.angularVelocity / 2);
        }
    }
  });

function clampAngleThetaTo2Pi(angle) {
    const twoPi = Math.PI * 2;
    return (angle % twoPi + twoPi) % twoPi;
}

function getRelativeAngle(bodyA, bodyB) {
    return bodyB.angle - bodyA.angle;
}

async function loadDefaultRagdoll(x, y) {
    const response = await fetch('./public/_Stickfigure.nodes');
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    loadStickfigureRagdoll(bytes, x, y);
}

/**
 * @param {Uint8Array<ArrayBuffer>} bytes
 */
async function loadStickfigureRagdoll(bytes, x, y) {
    const stickfigure = Stickfigure.from_bytes(bytes);
    const group = Body.nextGroup(true); 

    console.log(stickfigure.to_jsobject());

    let nodes = stickfigure.get_all_nodes();

    const nodeBodies = [];
    const nodeRelations = [];
    const nodeConstraints = [];

    //nodes = nodes.filter(node => node.draw_index == 0 || node.draw_index == 6 || node.draw_index == 7)

    nodes.forEach(node => {
        if (node.node_type != NodeType.RootNode) {
            const startOffset = calculateStartOffset(node);
            const endOffset = calculateEndOffset(node, startOffset);
            console.log(`${node.node_type} : ${node.draw_index} --> ${JSON.stringify(startOffset)}, ${JSON.stringify(endOffset)}`);
            

            const centerOffset = calculateCenterOffset(node, startOffset, stickfigure);
            const color = node.use_segment_color ? node.color : stickfigure.color;
            const angle = degreesToRadians(getGlobalAngle(node));
            switch (node.node_type) {
                case NodeType.Circle:
                    nodeBodies.push({
                        body: createCircleBodyFromNode(x, y, centerOffset.x, centerOffset.y, node.length, color.to_hex(), angle, group),
                        index: node.draw_index,
                        startOffset,
                        endOffset,
                        centerOffset,
                        length: node.length
                    })
                    break;
                case NodeType.RoundedSegment:
                    nodeBodies.push({
                        body: createRoundRectangleBodyFromNode(x, y, centerOffset.x, centerOffset.y, node.length, node.thickness, color.to_hex(), angle, group, startOffset, endOffset),
                        index: node.draw_index,
                        startOffset,
                        endOffset,
                        centerOffset,
                        length: node.length
                    })
                    break;
                default:
                    nodeBodies.push({
                        body: createRectangleBodyFromNode(x, y, centerOffset.x, centerOffset.y, node.length, node.thickness, color.to_hex(), angle, group),
                        index: node.draw_index,
                        startOffset,
                        endOffset,
                        centerOffset,
                        length: node.length
                    })
            }

            try {
                const parentIndex = node.get_parent_index()
                nodeRelations.push({
                    myIndex: node.draw_index,
                    myParentIndex: parentIndex
                });
            } catch (err) {
                console.log(err);
            }
        }
    });

    const connectedToRoot = [];

    nodeRelations.forEach(relation => {
        const bodyA = nodeBodies.find(body => body.index == relation.myIndex);
        const bodyB = nodeBodies.find(body => body.index == relation.myParentIndex);

        if (bodyB) {
            if (!bodyA || !bodyB) {
                console.warn("Missing body for constraint:", relation);
                return;
            }
            if (relation.myIndex == null || relation.myParentIndex == null) {
                console.warn("Missing index for relation:", relation);
                return;
            }

            const toLocalA = vectorDifference(bodyA.centerOffset, bodyA.endOffset);
            const toLocalB = vectorDifference(bodyB.centerOffset, bodyB.startOffset);

            const constraint = Constraint.create({ bodyA: bodyA.body, bodyB: bodyB.body, pointA: toLocalA, pointB: toLocalB, stiffness: 0.5, render: {visible: false}});

            nodeConstraints.push(constraint);
        } else {
            if (relation.myParentIndex == 0) {
                connectedToRoot.push(bodyA)
            }
        }
    });

    let theChosenOne = connectedToRoot.pop();
    connectedToRoot.forEach(body => {
        const bodyA = body;
        const bodyB = theChosenOne;

        if (!bodyA || !bodyB) {
            console.warn("Missing body for constraint:");
        }

        const toLocalA = vectorDifference(bodyA.centerOffset, bodyA.endOffset);
        const toLocalB = vectorDifference(bodyB.centerOffset, bodyB.endOffset);

        const constraint = Constraint.create({ bodyA: bodyA.body, bodyB: bodyB.body, pointA: toLocalA, pointB: toLocalB, stiffness: 0.5, render: {visible: false} });

        nodeConstraints.push(constraint);
    })

    nodeBodies.sort((a, b) => a.index - b.index);

    const bodyBodies = nodeBodies.map(body => body.body);

    World.add(world, [...bodyBodies, ...nodeConstraints]);
}

/**
 * @param {import("./sticknodes-js/sticknodes_js_web").Node} node
 */
function getGlobalAngle(node) {
    const ancestors = node.get_ancestor_nodes();

    let angle = 90;

    ancestors.forEach(ancestor => {
        angle += ancestor.local_angle;
    });

    angle += node.local_angle;

    return angle;
}
      
function unitVector(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy); // same as sqrt(dx*dx + dy*dy)
  
    if (length === 0) return { x: 0, y: 0 }; // Avoid division by zero
  
    return { x: dx / length, y: dy / length };
  }

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * @param {{ x: number; y: number; }} vector
 * @param {number} scalar
 */
function scaleVector(vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar };
}

/**
 * @param {{ x: number; y: number; }} a
 * @param {{ x: number; y: number; }} b
 */
function vectorDifference(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function calculateGlobalAngle(node) {
    const ancestors = node.get_ancestor_nodes();

    let globalAngle = 0;

    ancestors.forEach(ancestor => {
        globalAngle += ancestor.local_angle;
    });

    globalAngle += node.local_angle;

    return globalAngle;
}


/**
 * @param {import("./sticknodes-js/sticknodes_js_web").Node} node
 */
function calculateStartOffset(node) {
    const ancestors = node.get_ancestor_nodes();

    let startOffset = {
        x: 0,
        y: 0
    }

    ancestors.forEach(ancestor => {
        const localCoords = lengthAngleToXY(ancestor.length, calculateGlobalAngle(ancestor));

        startOffset.x -= localCoords.x || 0;
        startOffset.y -= localCoords.y || 0;
    })

    return startOffset;
}

/**
 * @param {import("./sticknodes-js/sticknodes_js_web").Node} node
 * @param {{ x: number; y: number; }} startOffset
 */
function calculateEndOffset(node, startOffset) {
    let endOffset = {
        x: startOffset.x,
        y: startOffset.y
    }

    const localCoords = lengthAngleToXY(node.length, calculateGlobalAngle(node));

    endOffset.x -= localCoords.x || 0;
    endOffset.y -= localCoords.y || 0;

    return endOffset;
}

function calculateCenterOffset(node, startOffset, stickfigure) {
    let centerOffset = {
        x: startOffset.x,
        y: startOffset.y
    }

    const localCoords = lengthAngleToXY(node.length, calculateGlobalAngle(node));

    centerOffset.x -= (localCoords.x / 2 || 0) 
    centerOffset.y -= (localCoords.y / 2 || 0);

    return {x: centerOffset.x, y: centerOffset.y};
}

function lengthAngleToXY(length, angleDegrees) {
    const angleRadians = angleDegrees * (Math.PI / 180);
    const x = length * Math.cos(angleRadians);
    const y = length * Math.sin(angleRadians);
    return {x, y};
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {number} length
 * @param {string} color
 */
function createCircleBodyFromNode(x, y, offsetX, offsetY, length, color, angle, group) {
    const finalX = x + offsetX;
    const finalY = y + offsetY;

    //console.log(`${type} : ${index} --> ${offsetX}, ${offsetY}`);

    if (isNaN(finalX) || isNaN(finalY)) {
        console.warn("Invalid position for circle body", { x, y, offsetX, offsetY });
    }

    return Bodies.circle(finalX, finalY, length / 2, { restitution: 0.2, render: {fillStyle: color}, angle, collisionFilter: {group}});

}

function createRectangleBodyFromNode(x, y, offsetX, offsetY, length, thickness, color, angle, group) {
    const finalX = x + offsetX;
    const finalY = y + offsetY;

    //console.log(`${type} : ${index} --> ${offsetX}, ${offsetY}`);

    if (isNaN(finalX) || isNaN(finalY)) {
        console.warn("Invalid position for rectangle body", { x, y, offsetX, offsetY });
    }

    if (thickness == 0) {
        thickness = 0.1;
        color = "#00000000"
    }

    return Bodies.rectangle(finalX, finalY, thickness, length, {restitution: 0.2, render: {fillStyle: color}, angle, collisionFilter: {group}});
}

function createRoundRectangleBodyFromNode(x, y, offsetX, offsetY, length, thickness, color, angle, group, startOffset, endOffset) {
    const finalX = x + offsetX;
    const finalY = y + offsetY;

    const finalStartX = x + startOffset.x;
    const finalStartY = y + startOffset.y;
    const finalEndX = x + endOffset.x;
    const finalEndY = y + endOffset.y;

    if (isNaN(finalX) || isNaN(finalY) || isNaN(finalStartX) || isNaN(finalStartY) || isNaN(finalEndX) || isNaN(finalEndY)) {
        console.warn("Invalid position for rectangle body", { x, y, offsetX, offsetY });
    }

    if (thickness == 0) {
        thickness = 100;
        color = "#00000000"
    }

    //return Bodies.rectangle(finalX, finalY, thickness, length, {render: {fillStyle: color}, angle, collisionFilter: {group}});

    const rect = Bodies.rectangle(finalX, finalY, thickness, length, {render: {fillStyle: color}, angle});
    const circleLeft = Bodies.circle(finalStartX, finalStartY, thickness / 2, {render: {fillStyle: color}});
    const circleRight = Bodies.circle(finalEndX, finalEndY, thickness / 2, {render: {fillStyle: color}});

    if (isNaN(finalX) || isNaN(finalY)) {
        console.warn("Invalid position for rectangle body", { x, y, offsetX, offsetY });
    }

    return Body.create({
        parts: [rect, circleLeft, circleRight], collisionFilter: {group}, restitution: 0.2
      });
}

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
    stiffness: 0.2,
    render: { visible: false }
    }
});
World.add(world, mouseConstraint);
render.mouse = mouse;

// Resize support
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight - 25 });
});

// Custom right-click menu
const contextMenu = document.getElementById('contextMenu');
const addBtn = document.getElementById('addRagdollBtn');
let clickX = 0, clickY = 0;

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    clickX = e.clientX;
    clickY = e.clientY;

    contextMenu.style.top = `${clickY}px`;
    contextMenu.style.left = `${clickX}px`;
    contextMenu.style.display = 'block';
});

document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

addBtn.addEventListener('click', () => {
    loadDefaultRagdoll(clickX, clickY);
});

const uploadBtn = document.getElementById('uploadStickfigureBtn');
const fileInput = document.getElementById('stickfigureFileInput');

// When "Upload Stickfigure" is clicked
uploadBtn.addEventListener('click', () => {
    fileInput.click(); // Trigger hidden file input
});

// When a file is selected
fileInput.addEventListener('change', () => {
    // @ts-ignore
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        // @ts-ignore
        const bytes = new Uint8Array(e.target.result);
        loadStickfigureRagdoll(bytes, clickX, clickY);
    };
    reader.readAsArrayBuffer(file);

    // Reset the file input so the same file can be reselected later
    // @ts-ignore
    fileInput.value = '';
});
