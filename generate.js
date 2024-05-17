const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateChar() {
    // Get character first
    const player = require('./char.json')

    // Image size
    const width = 2100;
    const height = 975;

    // Create the canvas
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background
    loadImage('./res/blur-bg.png').then(async (image) => {
        // Draw the background image
        context.drawImage(image, 0, 0, width, height);

        // Character splash
        await drawImg(context, './starrailres/' + player.characters[1].portrait, 0, 0, 2048, 2048, -275, 0, 975, 975)

        // Rectangle for info area
        await blurRoundedRect(context, 400, 0, width, height, 75, 200, 'rgba(0,0,0,0.5)')

        // Draw a line
        await drawDottedLine(context, 470, 0, height, width, 5, 'vertical');

        // Char name
        context.font = 'bold 55pt Nunito'
        context.textAlign = 'left'
        context.fillStyle = '#fff'
        context.fillText(player.characters[1].name, 550, 100)
    
        // Char level
        context.font = 'bold 24pt Nunito';
        context.textAlign = 'left';
        context.fillStyle = '#fff';
        context.fillText(`Level ${player.characters[1].level}/80`, 550, 150)

        // Char element & path
        loadImage('./starrailres/' + player.characters[1].path.icon).then((image) => {
            context.drawImage(image, 735, 115, 50, 50)
        })

        loadImage('./starrailres/' + player.characters[1].element.icon).then((image) => {
            context.drawImage(image, 795, 110, 50, 50)
        })

        // Stats string
        const stats = require('./stats.json')
        let statStrY = 45
        
        stats.forEach(a => {
            loadImage('./starrailres/' + a.icon).then((image) => {
                context.drawImage(image, 1000, statStrY, 60, 60);
                context.font = 'bold 25pt Nunito';
                context.textAlign = 'left';
                context.fillStyle = "#fff";
                context.fillText(a.name.includes("Boost") ? a.name.replace(" Boost", "") : a.name, 1080, statStrY + 42)
                statStrY += 75
            })
        })

        // Stats value
        let statValueY = 45;

        stats.forEach(a => {
            context.font = 'bold 25pt Nunito';
            context.textAlign = "end";
            context.fillStyle = "#fff";
            context.fillText(a.percent ? a.value + "%" : a.value, 1450, statValueY + 42);
            statValueY += 75;
        })

        drawDottedLine(context, 1000, 800, 1470, '#fff', 5, 'horizontal')
    
        // Light cone
        await drawTextOnNewLines(context, player.characters[1].light_cone.name, 700, 750)
    
        context.font = 'bold 20pt Nunito';
        context.textAlign = 'left';
        context.fillStyle = '#fff';
        context.fillText('Lv. 80/80', 750, 825)

        rotateImage('./starrailres/' + player.characters[1].light_cone.preview, 348).then((image) => {
            context.drawImage(image, 500, 700, 348 * 0.6, 408 * 0.6)
        })
        loadImage('./starrailres/icon/deco/Rarity' + player.characters[1].light_cone.rarity + '.png').then((image) => {
            context.drawImage(image, 520, 910, 612 * 0.3, 144 * 0.3)
        })

        drawCircleWithText(35, '#262626', '#dcc491', numToRoman(player.characters[1].light_cone.rank)).then((image) => {
            context.drawImage(image, 700, 800);
        })

        // Relics
        let relics = player.characters[1].relics;
        let main_stats = player.characters[1].relics.map(a => a.main_affix);
        let substatsArr = []
        let relicFocusY = 70;
        let relicIconsY = 70;
        let relicRarityY = 165;
        let relicLevelY = 100;
        let relicMainStatY = 165;
        let relicIconY = 70;
        relics.forEach(async a => {
            loadImage('./starrailres/' + a.icon).then((image) => {
                blurRoundedRect(context, 1490, relicFocusY, width, 130, 25, 5, 'rgba(255,255,255,0.2)')
                context.drawImage(image, 1525, relicIconsY, 108, 108);
                relicIconsY += 140;
                relicFocusY += 140;
            })
            loadImage('./starrailres/icon/deco/' + "Star" + a.rarity + ".png").then((image) => {
                context.drawImage(image, 1505, relicRarityY, 148, 32);
                relicRarityY += 140;
            })
            context.font = 'bold 20pt Nunito';
            context.textAlign = 'end';
            context.fillStyle = "#92c4fc";
            context.fillText("+" + a.level, 1675, relicLevelY);
            relicLevelY += 140;
            
            a.sub_affix.forEach(b => {
                substatsArr.push({ icon: './starrailres/' + b.icon, text: b.display });
            })
        })

        main_stats.forEach(a => {
            loadImage('./starrailres/' + a.icon).then((image) => {
                context.drawImage(image, 1690, relicIconY, 64, 64)
                relicIconY += 140;
            })
        })
        main_stats.forEach(a => {
            context.font = "bold 25pt Nunito";
            context.textAlign = "end";
            context.fillStyle = "#fff"
            context.fillText(a.display, 1750, relicMainStatY);
            relicMainStatY += 140;
        })
        
        // Light cone stats
        let lc_hpstat = player.characters[1].light_cone.attributes[0];
        loadImage('./starrailres/' + lc_hpstat.icon).then((image) => {
            context.drawImage(image, 700, 850, 48, 48)
            context.font = 'bold 18pt Nunito';
            context.textAlign = 'left';
            context.fillText(lc_hpstat.display, 750, 885)
        })

        let lc_atkstat = player.characters[1].light_cone.attributes[1];
        loadImage('./starrailres/' + lc_atkstat.icon).then((image) => {
            context.drawImage(image, 700, 900, 48, 48)
            context.font = 'bold 18pt Nunito';
            context.textAlign = 'left';
            context.fillText(lc_atkstat.display, 750, 930)
        })

        let lc_defstat = player.characters[1].light_cone.attributes[2];
        loadImage('./starrailres/' + lc_defstat.icon).then((image) => {
            context.drawImage(image, 850, 850, 48, 48)
            context.font = 'bold 18pt Nunito';
            context.textAlign = 'left';
            context.fillText(lc_defstat.display, 900, 885)
        })

        // UID and username
        context.font = 'medium 18pt Nunito';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.fillText(`${player.player.uid} - ${player.player.nickname}`, 150, 931)
        
        // Relic substats (quite weird enough on here)
        await drawIconsAndText(context, substatsArr, 1775, 75)
        
        // Traces / Talent / Skills //
        let mainTraces = player.characters[1].skill_trees.filter(a => !a.parent).filter(a => a.max_level > 1);
        let tracesIconY = 225;
        mainTraces.forEach(a => {
            loadImage('./starrailres/' + a.icon).then((image) => {
                drawCircleWithOutline(context, 590, tracesIconY + 40, 40, 'rgb(38, 38, 38)', 'rgb(115, 115, 115)', 5)
                context.drawImage(image, 555, tracesIconY + 4, 72, 72);

                // Trace level
                drawCircleWithOutline(context, 560, tracesIconY + 70, 16, 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0)', 0)
                context.font = 'bold 16pt Nunito';
                context.textAlign = 'center';
                context.fillStyle = '#fff'
                context.fillText(a.level, 560, tracesIconY + 78)
                tracesIconY += 100;
            })
        })
        
        // Relics name
        let relic_sets = player.characters[1].relic_sets.filter(a => a.properties.length > 0);
        let relicSetsY = 850;
        relic_sets.forEach(a => {
            context.font = 'bold 20pt Nunito';
            context.textAlign = 'left';
            context.fillStyle = '#fff'
            context.fillText(a.name, 1000, relicSetsY);
            blurRoundedRect(context, 1425, relicSetsY - 25, 40, 40, 10, 0, '#262626')
            context.fillText(a.num, 1437, relicSetsY + 3)
            relicSetsY += 50;
        })

        // Wait for the rendering to complete
        canvas.toBuffer((err, buffer) => {
            if (err) {
                console.error('Error rendering canvas:', err);
                return;
            }
            // Save canvas as image
            fs.writeFileSync('output.png', buffer);
            console.log('Image generated!');
        });
    })
}

function numToRoman(num) {
    if (isNaN(num)) return "";
    const roman_num = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
    };
    return roman_num[num];
}

async function drawDottedLine(context, startX, startY, endX, endY, lineWidth, orientation) {
    // Generate a line
    context.strokeStyle = 'white'; // Line color
    context.lineWidth = lineWidth; // Line width
  
    // Define the length of each dash and gap
    const dashLength = 10;
    const gapLength = 8;
  
    // Calculate the number of segments needed to cover the line based on the orientation
    let numSegments;
    if (orientation === 'vertical') {
      numSegments = Math.floor((endY - startY) / (dashLength + gapLength));
    } else if (orientation === 'horizontal') {
      numSegments = Math.floor((endX - startX) / (dashLength + gapLength));
    }
  
    // Begin drawing the line
    context.beginPath();
  
    // Draw each segment of the dotted line based on the orientation
    for (let i = 0; i < numSegments; i++) {
      if (orientation === 'vertical') {
        const y = startY + i * (dashLength + gapLength);
        // Move to the starting point of the segment
        context.moveTo(startX, y);
        // Draw a short dash
        context.lineTo(startX, y + dashLength);
      } else if (orientation === 'horizontal') {
        const x = startX + i * (dashLength + gapLength);
        // Move to the starting point of the segment
        context.moveTo(x, startY);
        // Draw a short dash
        context.lineTo(x + dashLength, startY);
      }
    }
  
    // Stroke the line
    context.stroke();
}  

// Function to draw a circle with an outline
function drawCircleWithOutline(ctx, x, y, radius, fillColor, outlineColor, outlineWidth) {
    // Draw the filled circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Draw the outline
    ctx.lineWidth = outlineWidth;
    ctx.strokeStyle = outlineColor;
    ctx.stroke();
}

// Function to draw icons and text in a grid layout on a canvas
async function drawIconsAndText(ctx, iconTextArray, startX, startY) {
    // Loop through each item in the array
    let yOffset = startY;
    let xOffset = startX;
    for (const item of iconTextArray) {
      // Load the icon image
      const icon = await loadImage(item.icon);
  
      // Draw the icon
      ctx.drawImage(icon, xOffset + 10, yOffset, 50, 50); // Adjust icon position and size as needed
  
      // Draw the text
      ctx.font = 'bold 25px Nunito'; // Adjust font size and style as needed
      ctx.fillStyle = 'white'; // Adjust text color as needed
      ctx.fillText(item.text, xOffset + 60, yOffset + 35); // Adjust text position as needed
  
      // Increment the x-offset for the next item or reset to the beginning of the next row
      if (xOffset === startX) {
        xOffset = startX + 150; // Adjust horizontal spacing between items as needed
      } else {
        xOffset = startX;
        yOffset += 70; // Adjust vertical spacing between rows as needed
      }
    }
}

// Function to draw text on separate lines in a canvas
async function drawTextOnNewLines(ctx, text, x, y) {
    // Split the text into an array of words
    const words = text.split(' ');
  
    // Divide the words into two parts
    const halfIndex = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, halfIndex).join(' ');
    const secondPart = words.slice(halfIndex).join(' ');
  
    // Draw the first line of text
    ctx.font = "bold 20pt Nunito";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(firstPart, x, y);
  
    // Draw the second line of text below the first line
    ctx.font = "bold 20pt Nunito";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(secondPart, x, y + 30);
}

// Function to draw a circle with text inside on a canvas
async function drawCircleWithText(diameter, color, textColor, text) {
    // Create a canvas with the specified diameter
    const canvas = createCanvas(diameter, diameter);
    const ctx = canvas.getContext('2d');
  
    // Draw the circle
    ctx.beginPath();
    ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  
    // Draw the text
    ctx.font = 'bold 20px Nunito'; // Adjust font size and style as needed
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, diameter / 2, diameter / 2);
  
    // Return the canvas
    return canvas;
}

// Function to draw an image with accompanying text
async function drawImageWithText(ctx, iconUrl, text, x, y, iconSize) {
    try {
      // Load icon image
      const icon = await loadImage(iconUrl);
      // Draw the image onto the canvas
      ctx.drawImage(icon, x, y, iconSize, iconSize);
  
      // Draw text
      ctx.font = 'bold 25pt Nunito';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(text, x + iconSize + 10, y + 45); // Adjust text position
    } catch (err) {
      console.error('Error loading image:', err);
    }
}

async function drawImg(ctx, imgUrl, x, y, imgResX, imgResY, srcX, srcY, desX, desY) {
    try {
        const img = await loadImage(imgUrl);
        ctx.drawImage(img, x, y, imgResX, imgResY, srcX, srcY, desX, desY);
    } catch (e) {
        console.error(e)
    }
}

// Function to draw a rounded rectangle on a canvas
async function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}
  
// Function to apply a blur effect within a rounded rectangle on a canvas
function blurRoundedRect(ctx, x, y, width, height, radius, blurAmount, color) {
    // Create a temporary canvas to apply the blur effect
    const tempCanvas = createCanvas(width, height);
    const tempCtx = tempCanvas.getContext('2d');
  
    // Draw the rounded rectangle on the temporary canvas
    tempCtx.fillStyle = color; // Fill color doesn't matter, as it won't be visible
    drawRoundedRect(tempCtx, 0, 0, width, height, radius);
  
    // Apply blur effect to the temporary canvas
    tempCtx.filter = `blur(${blurAmount}px)`; // Set the blur amount
  
    // Draw the blurred rounded rectangle onto the main canvas
    ctx.drawImage(tempCanvas, x, y);
}

async function rotateImage(imagePath, rotationAngleInDegrees) {
    // Load the image
    const image = await loadImage(imagePath);
  
    // Create a canvas
    const canvasWidth = image.width;
    const canvasHeight = image.height;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
  
    // Convert rotation angle from degrees to radians
    const rotationAngle = rotationAngleInDegrees * (Math.PI / 180);
  
    // Translate the canvas origin to the center of the image
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
  
    // Rotate the canvas
    ctx.rotate(rotationAngle);
  
    // Draw the rotated image
    ctx.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
  
    // Reset transformations (translate and rotate) to avoid affecting subsequent drawings
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  
    // Return the rotated canvas
    return canvas;
}

generateChar()