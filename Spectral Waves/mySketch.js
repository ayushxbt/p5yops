/*
=======================================================================
Spectral Waves
=======================================================================

Description:
This script generates a visually captivating canvas with wave-like shapes
using a unique color palette. The artwork is designed to evoke a sense of
harmony and tranquility through its dynamic and rhythmic patterns.

Specifications:
- Language: JavaScript (p5.js)
- Version: 1.0.0
- Author: 0xMilord
- Website: https://linktr.ee/0xmilord/
- GitHub: https://github.com/0xmilord/

License:
This artwork is licensed under the Attribution
-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0).
For details, see the full license text at: 
https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

Scope of License:
You are free to:
- Share: Copy and redistribute the material in any medium or format.
- Adapt: Remix, transform, and build upon the material.

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license,
  and indicate if changes were made. You may do so in any reasonable manner,
  but not in any way that suggests the licensor endorses you or your use.
- NonCommercial: You may not use the material for commercial purposes.
- ShareAlike: If you remix, transform, or build upon the material, you must
  distribute your contributions under the same license as the original.

=======================================================================
*/


// Initialize a variable to store the seed for randomization
let sn;

const URLS = [
    "https://coolors.co/app/8c2b3d-e24347-f2b447-88b7b5-ed665d",
    "https://coolors.co/app/635dFF-60a3bc-3b444b-ea6a47-84b59f",
    "https://coolors.co/app/36486b-3e92cc-dce1e3-f0f7f4-e4e4e4",
    "https://coolors.co/app/fe938c-e6b89c-ead2ac-9cafb7-4281a4",
    "https://coolors.co/app/5e2b52-9e0031-6a0572-ab83a1-f1e4e8",
    "https://coolors.co/app/ff8b94-9b72aa-0a043c-faf3f3-a0ced9",
    "https://coolors.co/app/003049-d62828-f77f00-fcbf49-eae2b7",
    "https://coolors.co/app/011627-fdfffc-2ec4b6-e71d36-ff9f1c",
    "https://coolors.co/app/46237a-6b4226-917c50-7b9d8f-9a8c98",
    "https://coolors.co/app/ff7473-ffc952-47b8e0-34314c-540b0e",
    "https://coolors.co/app/caced1-b55d00-c48613-e8ca25-676d65",
    "https://coolors.co/app/d3393d-ed7536-f7c6a4-b1ab5c-aeb678",
    "https://coolors.co/app/3893c3-173753-6daedb-1b4353-55dde0",
    // Additional palettes
    "https://coolors.co/app/4281a4-df8a76-dfd4a5-a0a08a-8b8c89",
    "https://coolors.co/app/98c1d9-72869f-59656f-545e63-525252",
    "https://coolors.co/app/f08a5d-e2d8bc-5e8b7e-4d8482-495867",
    "https://coolors.co/app/262730-858f97-cacfd2-e0b084-a1674b",
    "https://coolors.co/app/edf6f9-d3f5f9-a0e5e8-79c3db-4d9bc5",
    "https://coolors.co/app/e6f1ff-b8d8d8-a3c4bc-ba7967-c85b6c",
    "https://coolors.co/app/002626-0a444e-14716c-197b80-3a888a",
    "https://coolors.co/app/002b36-073642-586e75-657b83-839496",
    "https://coolors.co/app/fbffe3-ccdc39-4a9a42-002635-001e1d",
    "https://coolors.co/app/1b262c-394240-6a7b82-9a8c98-c9ada7",
    "https://coolors.co/app/001219-005f73-0a9396-94d2bd-e9d8a6",
    "https://coolors.co/app/010615-062535-053e5d-5a767d-66a182",
    "https://coolors.co/app/007ea7-005691-003366-001d4a-00051e",
    "https://coolors.co/app/ffb400-383c45-1e1e20-fbfbff-a4a4a4",
    "https://coolors.co/app/ffcb77-ffe066-19a974-247153-2b4e4a",
    "https://coolors.co/app/ff9a8b-ff789c-ff577f-ff3352-ff1045",
    "https://coolors.co/app/ff7e5f-feb47b-e29a45-c0caad-79a68f",
    "https://coolors.co/app/1d1128-460d42-7a0c4d-9d174d-c8d9eb",
    "https://coolors.co/app/003344-2c5e4f-66a182-8cbf8a-afccab",
    "https://coolors.co/app/00274d-004d8a-0081cf-00a4e4-00bfff",
    "https://coolors.co/app/f582ae-ed80a1-ff5a5f-dc223d-b83b5e",
    "https://coolors.co/app/edc7b7-b7a69e-6b4226-ab83a1-917c50",
    "https://coolors.co/app/0077b6-005082-004d6b-015c92-001b44",
    "https://coolors.co/app/65aeb4-7fb7be-8b9dc3-9a9bc1-a59edf",
    "https://coolors.co/app/0a1b25-8da5b7-b5c9d6-e6efff-f0f5f9",
    "https://coolors.co/app/482c3d-3e4a63-2b6691-247ba0-1b98e0",
    "https://coolors.co/app/ff6b6b-ff8e71-ffb08f-ffcc80-ffeaa7",
    "https://coolors.co/app/9a348e-e4a0f7-a3de83-65ab9d-547980",
    "https://coolors.co/app/204051-3b6978-84a9ac-9cb4c0-cce1e3",
    "https://coolors.co/app/dfe0df-bdbbbb-a49f9f-827777-635f5f",
    "https://coolors.co/app/e63946-f1faee-a8dadc-457b9d-1d3557",
    "https://coolors.co/app/fde3a7-fad02e-ee9b00-d74e09-4d3900",
    "https://coolors.co/app/ffe66d-ffb86f-ff7e5f-d3725c-8c271e",
    "https://coolors.co/app/ff6e40-ffe259-ffa07a-df5e88-9b4d8f",
    "https://coolors.co/app/0b3954-087e8b-bfd7ea-ff5a5f-c81d25",
    "https://coolors.co/app/f4faff-a3daff-4e8aff-223f9a-1a1c3b",
    "https://coolors.co/app/fec3a1-fd9d92-fd7479-fb403b-2b2d42",
    "https://coolors.co/app/2a2b2e-2b4162-1f637c-48a9a6-e7d7c1",
    "https://coolors.co/app/091540-7692ff-fcfcfc-fcec9a-fe8a71",
    "https://coolors.co/app/ff6978-fffcf9-f49a8b-2f1a28-22181c",
    "https://coolors.co/app/002b36-006d77-83c5be-edf6f9-ffffff",
    "https://coolors.co/app/331832-5c375e-8e4162-9f5f80-c396a1",
    "https://coolors.co/app/002c2b-005a5b-008c8d-00bebc-00d8d6",
    "https://coolors.co/app/151f34-6b4226-a68c6e-d9bf77-7a5e4e",
    "https://coolors.co/app/433d3e-6c757d-a9a9a9-e0e0e0-ffffff",
    "https://coolors.co/app/8ecae6-219ebc-023047-ffb703-f76d57",
    "https://coolors.co/app/011627-023047-03a696-fef02a-f7f7f8",
];


// Variable to store the parsed color palettes
let cols;

let gra;

function setup() {
    // Set canvas size to the minimum of window width and height
    let s = min(windowWidth, windowHeight);
    createCanvas(s, s);

    // Set shadow properties for the main canvas
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 45;
    drawingContext.shadowBlur = height / 3;

    // Set color mode to HSB for the entire canvas
    colorMode(HSB, 100);
    cols = createCols(URLS[int(random(URLS.length))]);
    sn = int(random(100));

    // Initialize the 'gra' (graphics) buffer for additional elements
    gra = createGraphics(windowWidth, windowHeight);
    gra.noStroke();

    // Generate a background pattern in the 'gra' buffer
    generateBackgroundPattern();

    // Add event listener for canvas click
    canvas.addEventListener('click', canvasClicked);
}

function draw() {
    // ... (same as before)
}

function canvasClicked() {
    // Reset the random seed
    sn = int(random(100));

    // Regenerate the background pattern in the 'gra' buffer
    generateBackgroundPattern();
}

function generateBackgroundPattern() {
    gra.clear(); // Clear the existing graphics buffer

    // Generate a background pattern in the 'gra' buffer
    for (let i = 0; i < 300000; i++) {
        // Generate random coordinates within the 'gra' buffer
        let x = random(gra.width);
        let y = random(gra.height);

        // Generate a size using Perlin noise for variation
        let s = noise(x * 0.01, y * 0.01) * 2;

        // Fill the graphics buffer with rectangles
        gra.fill(240, 20);
        gra.rect(x, y, s, s);
    }
}

function draw() {
    // Update canvas size on window resize
    if (width !== windowWidth || height !== windowHeight) {
        resizeCanvas(windowWidth, windowHeight);
        gra = createGraphics(windowWidth, windowHeight);
        gra.noStroke();
    }

    // Set the background to a light shade
    background(245);

    // Seed for consistent random values
    randomSeed(sn);

    // Define the multiplier for the span of the waves
    let spanYMult = 2 + 0.01 * sin(frameCount / 100);

    // Loop through the height of the canvas, creating wave-like shapes
    for (let y = height * 0.001; y <= height; y *= spanYMult) {
        // Calculate the height of each wave based on the y-coordinate
        const h = pow(map(y, 0, height, 0, 1), 0.5) * height * 0.9;

        // Offset for creating dynamic wave patterns
        const offX = pow(map(y, 0, height, 0, 1), 0.5) * frameCount * 5 - y * 10;

        // Adjust the noise multiplier for varying wave shapes
        const noiseMult = map(y, 0, height, 0.01, 0.002);

        // Disable stroke for smoother appearance
        noStroke();

        // Adjust the shadow intensity based on the y-coordinate
        const sbri = map(y, 0, height, 80, 30);

        // Randomly select a color from the palette
        let col = cols[int(random(cols.length))];

        // Create a shadow color for the fill effect
        let sCol = color(0, 0, sbri, 80);

        // Set the fill color with the selected color
        fill(col);

        // Apply the shadow color to the drawing context
        drawingContext.shadowColor = sCol;

        // Call the mountain function to draw the wave-like shape
        mountain(y, h, offX, noiseMult);
    }

    // Draw the generated graphics onto the main canvas
    image(gra, 0, 0);
}


function mountain(_y, _maxH, _noiseXOff, _noiseMult = 0.01, xVertSpan = 3) {
    // Begin the shape to define the mountain
    beginShape();
    
    // Iterate over the width of the canvas with specified xVertSpan
    for (let x = 0; x <= width; x += xVertSpan) {
        // Generate Perlin noise values to create variations
        const nv = noise((x + _noiseXOff) * _noiseMult, _y * _noiseMult);
        const nv2 = noise((x + _noiseXOff) * _noiseMult * 10, _y * _noiseMult * 100);

        // Calculate vertex position using noise values and height parameters
        vertex(x, _y + _maxH * 0.9 * nv + _maxH * 0.1 * nv2);
    }

    // Connect the shape by adding vertices at the bottom corners of the canvas
    vertex(width, height);
    vertex(10, height);

    // Close the shape to ensure a filled area
    endShape(CLOSE);
}

function createCols(_url) {
    // Find the last index of '/' in the URL to extract the palette string
    let slash_index = _url.lastIndexOf('/');
    // Slice the URL to get the palette string after the last '/'
    let palette_str = _url.slice(slash_index + 1);
    // Split the palette string into an array using '-' as the separator
    let arr = palette_str.split('-');

    // Prepend '#' to each color value in the array to make it a valid hexadecimal color code
    for (let i = 0; i < arr.length; i++) {
        arr[i] = '#' + arr[i];
    }

    // Return the array of color values
    return arr;
}
