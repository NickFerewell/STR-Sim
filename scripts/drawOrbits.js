class drawOrbits{ 
    constructor(){

    }
    static numSteps = 1000;
    static timeStep = 0.1;
    static usePhysicsTimeStep;

    static relativeToBody = true;
    static centralBody = referenceBody;
    static width = 100;
    static useThickLines = true;

    Start () {
        if (Application.isPlaying) {
            HideOrbits ();
        }
    }

    Update () {
        if (DEBUG_MODE) {
            DrawOrbits ();
        }
    }

    DrawOrbits () {
        var bodies = stellarBodies;
        var virtualBodies = [];
        var drawPoints = [][];
        var referenceFrameIndex = 0;
        var referenceBodyInitialPosition = {x: 0, y: 0};

        // Initialize virtual bodies (don't want to move the actual bodies)
        for (int i = 0; i < bodies.Length; i++) {
            virtualBodies[i] = new VirtualBody (bodies[i]);
            // drawPoints[i] = new Vector3[numSteps];

            if (bodies[i] == centralBody && relativeToBody) {
                referenceFrameIndex = i;
                referenceBodyInitialPosition = virtualBodies[i].position;
            }
        }

        // Simulate
        for (var step = 0; step < numSteps; step++) {
            var referenceBodyPosition = (relativeToBody) ? virtualBodies[referenceFrameIndex].position : Vector3.zero;
            // Update velocities
            for (var i = 0; i < virtualBodies.Length; i++) {
                virtualBodies[i].velocity += CalculateAcceleration (i, virtualBodies) * timeStep;
            }
            // Update positions
            for (int i = 0; i < virtualBodies.Length; i++) {
                var newPos = myMult(myAdd(virtualBodies[i].position, virtualBodies[i].velocity), timeStep);
                virtualBodies[i].position = newPos;
                if (relativeToBody) {
                    var referenceFrameOffset = mySub(referenceBodyPosition, referenceBodyInitialPosition);
                    newPos = myMult(referenceFrameOffset, -1);
                }
                if (relativeToBody && i == referenceFrameIndex) {
                    newPos = referenceBodyInitialPosition;
                }

                drawPoints[i][step] = newPos;
            }
        }

        // Draw paths
        for (var bodyIndex = 0; bodyIndex < virtualBodies.Length; bodyIndex++) {
            var pathColour = bodies[bodyIndex].gameObject.GetComponentInChildren<MeshRenderer> ().sharedMaterial.color; //

            if (useThickLines) {
                var lineRenderer = bodies[bodyIndex].gameObject.GetComponentInChildren<LineRenderer> ();
                lineRenderer.enabled = true;
                lineRenderer.positionCount = drawPoints[bodyIndex].Length;
                lineRenderer.SetPositions (drawPoints[bodyIndex]);
                lineRenderer.startColor = pathColour;
                lineRenderer.endColor = pathColour;
                lineRenderer.widthMultiplier = width;
            } else {
                for (int i = 0; i < drawPoints[bodyIndex].Length - 1; i++) {
                    Debug.DrawLine (drawPoints[bodyIndex][i], drawPoints[bodyIndex][i + 1], pathColour);
                }

                // Hide renderer
                var lineRenderer = bodies[bodyIndex].gameObject.GetComponentInChildren<LineRenderer> ();
                if (lineRenderer) {
                    lineRenderer.enabled = false;
                }
            }

        }
    }

    CalculateAcceleration (i, virtualBodies) {
        var acceleration = myVector.zero;
        for (int j = 0; j < virtualBodies.Length; j++) {
            if (i == j) {
                continue;
            }
            Vector3 forceDir = (virtualBodies[j].position - virtualBodies[i].position).normalized;
            float sqrDst = (virtualBodies[j].position - virtualBodies[i].position).sqrMagnitude;
            acceleration += forceDir * Universe.gravitationalConstant * virtualBodies[j].mass / sqrDst;
        }
        return acceleration;
    }

    HideOrbits () {
        CelestialBody[] bodies = FindObjectsOfType<CelestialBody> ();

        // Draw paths
        for (int bodyIndex = 0; bodyIndex < bodies.Length; bodyIndex++) {
            var lineRenderer = bodies[bodyIndex].gameObject.GetComponentInChildren<LineRenderer> ();
            lineRenderer.positionCount = 0;
        }
    }

    OnValidate () {
        if (usePhysicsTimeStep) {
            timeStep = Universe.physicsTimeStep;
        }
    }
}

class VirtualBody {
    constructor(body) {
        this.position = body.body.position;
        this.velocity = body.initialVelocity;
        this.mass = body.body.mass;
    }
}