const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateChar() {
    // Image size
    const width = 2100;
    const height = 975;

    // Create the canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background
    loadImage('./res/blur-bg.png').then((image) => {
        // Draw the background image
        context.drawImage(image, 0, 0, width, height);

        // Generate a line
        context.strokeStyle = 'white'; // Line color
        context.lineWidth = 2; // Line width

        // Define the starting and ending points of the vertical line
        const startX = 550; // X-coordinate of the line
        const startY = 0; // Starting Y-coordinate of the line
        const endY = height; // Ending Y-coordinate of the line

        // Define the length of each dash and gap
        const dashLength = 10;
        const gapLength = 8;

        // Calculate the number of segments needed to cover the line
        const numSegments = Math.floor((endY - startY) / (dashLength + gapLength));

        // Begin drawing the line
        context.beginPath();

        // Draw each segment of the dotted line
        for (let i = 0; i < numSegments; i++) {
            const y = startY + i * (dashLength + gapLength);
            // Move to the starting point of the segment
            context.moveTo(startX, y);
            // Draw a short dash
            context.lineTo(startX, y + dashLength);
        }

        // Stroke the line
        context.stroke();
        
        // Char name
        context.font = 'bold 55pt Nunito'
        context.textAlign = 'center'
        context.fillStyle = '#fff'
        context.fillText("NAME", 800, 100)

        // Char level
        context.font = 'bold 20pt Nunito';
        context.textAlign = 'left';
        context.fillStyle = '#fff';
        context.fillText("LEVEL", 635, 150)

        // Light cone
        context.font = 'bold 20pt Nunito';
        context.textAlign = 'left';
        context.fillStyle = '#fff';
        context.fillText("LIGHT CONE NAME", 635, 800)


        // UID and username
        context.font = 'bold 18pt Nunito';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(`123456789 - NICKNAME`, 175, 931)
        
        // Output
        const result = canvas.toBuffer('image/png');
        fs.writeFileSync('./result.png', result)
        return console.log("Image generated!")
    })

}

generateChar()