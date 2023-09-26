![header](https://github.com/breadloafsky/fuzzy-life/blob/master/res/header.PNG?raw=true)
# Fuzzy Life
A WebGL implementation of generalization of Conway’s ”Game of Life” to a
continuous domain
## Demo
https://fuzzy-life.netlify.app

## About

The application is based on SmoothLife paper ([https://arxiv.org/pdf/1111.1567.pdf](https://arxiv.org/pdf/1111.1567.pdf)) with some additions:

- Instead two neighbourghood fillings, the application uses weighted averages of convolution integral of the area and a kernel within the radius ***r*** :\
\
![equation](https://github.com/breadloafsky/fuzzy-life/blob/master/res/eq0.png?raw=true)

- Kernels are generated by the user-defined curve that represents a cross section of kernel values along the radius.


## Usage

#### Keyboard Shortcuts
- SPACEBAR - start / pause the evaluation
- C - clear the screen
- X - fill the screen with a sinusoidal pattern

#### Mouse Brush Controls
- LMB - draw on the canvas.
- RMB - erase.
- Mouse Wheel - change the radius of the brush.