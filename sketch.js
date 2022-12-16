//From ASCII Library, pseudo object
var myAsciiArt;

//The size of generated ASCII graphics expressed in characters and lines.
var asciiart_width = 120; 
var asciiart_height = 60;

//Webcam
var myCapture

/*
  Buffer for processed graphics, simplifying some operations. This will be an
  object derived from the p5.Graphics class
*/
var gfx;

/*
  This variable will store a two-dimensional array - "image" in the form of
  ASCII codes.
*/
var ascii_arr;

/*
  And this flag will inform the program whether to display the source image
  from the camera. We will switch the flag with taps/clicks.
*/
var showOryginalImageFlag = false;

//Function for initializing capture device, with error codes if needed
function initCaptureDevice() {
  try {
    myCapture = createCapture(VIDEO);
    myCapture.size(640, 480);
    myCapture.elt.setAttribute('playsinline', '');
    myCapture.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      myCapture.width + ' ' + myCapture.height
    );
  } catch(_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight); 
  initCaptureDevice(); 
  /*
    In this particular case the gfx helper should have dimensions the same as
    the target graphic.
  */
  gfx = createGraphics(asciiart_width, asciiart_height);
  gfx.pixelDensity(1); //1-4 density is about as high as my mac can stream, don't make it any more dense
  myAsciiArt = new AsciiArt(this);
  myAsciiArt.printWeightTable();

  // Text Styling
  textAlign(CENTER, CENTER); 
  textFont('Space Grotesk', 20); 
  textStyle(BOLD);
  //noStroke(); 
  //fill(48,188,237); //CYAN
  //fill(255); //WEIß
  //fill(255,165,0); //ANSI ORANGE 1
  fill(0,175,0); //ANSI GREEN 3


  frameRate(23.997);
}

function draw() {
  if(myCapture !== null && myCapture !== undefined) { 
    background(29,29,29); //Dark Grey 
    /*
      Prep the image for conversion. 
    */
    gfx.background(0);
    gfx.image(myCapture, 0, 0, gfx.width, gfx.height);
   
    //Send to Posterizing  
    gfx.filter(POSTERIZE,4);
    
    /*
      Here the processed image is converted to the ASCII art. The convert()
      function in this case is used with just one parameter (image we want to
      convert), so the resultant ASCII graphics will have the same resolution
      as the image. If necessary (especially if the resolution of the converted
      image is relatively high), it is possible to use the converter function
      in the version with three parameters: then the second and third
      parameters will be respectively the width and height of the generated
      glyph table. The convert() function returns a two-dimensional array of
      characters containing the representation of the converted graphics in the
      form of the ASCII art. If the conversion fails, the function returns
      null.
    */
    ascii_arr = myAsciiArt.convert(gfx);

    if(showOryginalImageFlag) image(myCapture, 0, 0, width, height);
    /*
      Now it's time to show ASCII art on the screen. First, we set drawing
      parametrs. Next, we call the function typeArray2d() embedded in the
      ASCII Art library, that writes the contents of a two-dimensional array
      containing (implicitly) text characters (chars) on the screen. In this
      case, we call a function with 2 parameters: the first is the table
      whose contents we want to print, and the second is the destination (an
      object with "canvas" property). If you use the function with two
      parameters (as we do in this example), it will assume that you need to
      fill the entire surface of the target canvass with a drawing. However,
      the function can be called in 3 variants:
        [AsciiArt instance].typeArray2d(_arr2d, _dst);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y);
        [AsciiArt instance].typeArray2d(_arr2d, _dst, _x, _y, _w, _h);
      The parameters are as follows:
        _arr2d - 2-dimentional array containing glyphs (chars)
        _dst - destination (typically the sketch itself)
        _x, _y - coordinates of the upper left corner
        _w, _h - width and height
      It is relatively easy to write your own function that formats the contents
      of an array to ASCII graphics. At the end of this example, I glue the
      function code from a non-minimized version of the library - it can be
      used as a base for your own experiments.
    */
    myAsciiArt.typeArray2d(ascii_arr, this);
  }
  else {
    /*
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    background(255, 0, 0);
  }
}

function mouseReleased() {
  /*
    The flag controlling the display of the image coming from the camera is
    switched by tap/click.
  */
 showOryginalImageFlag = !showOryginalImageFlag;
}

//From Library
/*
  *****************************************************************************
  ******************************** typeArray2d ********************************
  Slightly reworked part of the oryginal code from the ASCII Art library - you
  can redesign this to suit your needs.
  *****************************************************************************
  A simple function to help us print the ASCII Art on the screen. The function
  prints a two-dimensional array of glyphs and it is used similarly to the
  standard method of displaying images. It can be used in versions with 2, 4 or
  6 parameters. When using the version with 2 parameters, the function assumes
  that the width and height of the printed text block is equal to the width and
  height of the working space (that's mean: equal to the _dst size) and it
  starts drawing from upper left corner (coords: 0, 0). When using the version
  with 4 parameters, the function assumes that the width and height of the
  printed text block is equal to the width and height of the working space
  (that's mean: equal to the _dst size). _arr2d is the two-dimensional array of
  glyphs, _dst is destinetion (basically anything with 'canvas' property, such
  as p5js sketch or p5.Graphics).
*/
typeArray2d = function(_arr2d, _dst, _x, _y, _w, _h) {
  if(_arr2d === null) {
    console.log('[typeArray2d] _arr2d === null');
    return;
  }
  if(_arr2d === undefined) {
    console.log('[typeArray2d] _arr2d === undefined');
    return;
  }
  switch(arguments.length) {
    case 2: _x = 0; _y = 0; _w = width; _h = height; break;
    case 4: _w = width; _h = height; break;
    case 6: /* nothing to do */ break;
    default:
      console.log(
        '[typeArray2d] bad number of arguments: ' + arguments.length
      );
      return;
  }
  
  if(_dst.canvas === null) {
    console.log('[typeArray2d] _dst.canvas === null');
    return;
  }
  if(_dst.canvas === undefined) {
    console.log('[typeArray2d] _dst.canvas === undefined');
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext('2d');
  if(temp_ctx2d === null) {
    console.log('[typeArray2d] _dst canvas 2d context is null');
    return;
  }
  if(temp_ctx2d === undefined) {
    console.log('[typeArray2d] _dst canvas 2d context is undefined');
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  for(var temp_y = 0; temp_y < _arr2d[0].length; temp_y++)
    for(var temp_x = 0; temp_x < _arr2d.length; temp_x++)
      /*text*/temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
}