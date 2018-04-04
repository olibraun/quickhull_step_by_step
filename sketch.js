// Quickhull implementation and visualization

let S = [];
const numberOfPoints = 800;
const margin = 40;

let convexHull = [];

let clearButton;

function setup() {
  createCanvas(1000, 800);
  background(51);

  clearButton = createButton('Clear');
  clearButton.mousePressed(() => {
    S = [];
  });
}

function draw() {
  // draw background
  background(51);

  QuickHull(S);

  // draw points
  push();
  strokeWeight(4);
  stroke(255);
  S.forEach(s => {
    point(s.x, s.y);
  });
  pop();

  // draw convex hull
  push();
  noFill();
  strokeWeight(2);
  stroke(0, 250, 0);
  beginShape();
  for(let i = 0; i < convexHull.length; i++) {
    const s = convexHull[i];
    vertex(s.x, s.y);
  }
  endShape(CLOSE);
}

function QuickHull(S) {
  // Find convex hull from the set S of n points
  convexHull = [];

  // If there aren't at least two points in S, there is nothing to do.
  if(S.length < 2) {
    return;
  }

  // Find left and right most points, say A & B, and add A & B to convex hull

  let minX = width;
  let maxX = 0;
  let minXIndex = 0;
  let maxXIndex = 0;
  for(let i = 0; i < S.length; i++) {
    if(S[i].x < minX) {
      minX = S[i].x;
      minXIndex = i;
    }
    if(S[i].x > maxX) {
      maxX = S[i].x;
      maxXIndex = i;
    }
  }

  // A and B have been found by this procedure.
  const A = S[minXIndex];
  const B = S[maxXIndex];
  convexHull.push(A);
  convexHull.push(B);

  // Segment AB divides the remaining (n-2) points into 2 groups S1 and S2 
  // where S1 are points in S that are on the right side of the oriented line from A to B, 
  // and S2 are points in S that are on the right side of the oriented line from B to A
  let S1 = [];
  let S2 = [];
  partition(S, A, B, S1, S2);
  FindHull(S1, A, B);
  FindHull(S2, B, A);
}

function FindHull(Sk, P, Q) {
  // Find points on convex hull from the set Sk of points 
  // that are on the right side of the oriented line from P to Q

  // If Sk has no point, then return.
  if(Sk.length == 0) {
    return;
  }

  // From the given set of points in Sk, find farthest point, say C, from segment PQ
  let maxDist = 0;
  let C;
  Sk.forEach(s => {
    const dist = distLinePointSq(P, Q, s);
    if(dist > maxDist) {
      maxDist = dist;
      C = s;
    }
  });

  // Add point C to convex hull at the location between P and Q.
  const Ppos = convexHull.findIndex(x => x == P);
  const Qpos = convexHull.findIndex(x => x == Q);
  Ppos < Qpos ? convexHull.splice(Ppos + 1, 0, C) : convexHull.splice(Qpos, 0, C);

  // Three points P, Q, and C partition the remaining points of Sk into 3 subsets: S0, S1, and S2 
  // where S0 are points inside triangle PCQ, S1 are points on the right side of the oriented 
  // line from  P to C, and S2 are points on the right side of the oriented line from C to Q. 
  let S1 = [];
  let S2 = [];
  partition(Sk, P, C, S1, []);
  partition(Sk, C, Q, S2, []);
  FindHull(S1, P, C);
  FindHull(S2, C, Q);
}

function partition(S, A, B, S1, S2) {
  const AB = createVector(B.x - A.x, B.y - A.y);
  const ABperp = createVector(- AB.y, AB.x);
  const limitValue = ABperp.x * A.x + ABperp.y * A.y;
  for (let i = 0; i < S.length; i++) {
    if (S[i] != A && S[i] != B) {
      const scalarprod = S[i].x * ABperp.x + S[i].y * ABperp.y;
      if (scalarprod >= limitValue) {
        S1.push(S[i]);
      }
      else {
        S2.push(S[i]);
      }
    }
  }
}

function distLinePointSq(A,B,C) {
  const numerator = Math.abs( (B.y-A.y)*C.x - (B.x-A.x)*C.y + B.x*A.y - B.y*A.x );
  const denominator = (B.y-A.y)**2 + (B.x-A.x)**2;
  return (numerator**2)/denominator;
}

function mouseClicked() {
  if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }
  
  const v = createVector(mouseX, mouseY);
  let alreadyContained = false;
  for(let i = 0; i < S.length; i++) {
    if(S[i].x == v.x && S[i].y == v.y) {
      alreadyContained = true;
      break;
    }
  }
  if(!alreadyContained) {
    S.push(v);
  }
}