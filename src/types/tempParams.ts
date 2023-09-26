export class Brush {
	x:number=0.5;	// pos x
	y:number=0.5;	// pos y
	r:number=16;	// radius in pixels
	type:number=0;	// type 0:hidden, 1: display brush, 2: draw, 3: erase
}

export class TempParams{
	rule:number[] = [0];
	kernelTexture:any=null;		// kernel RGB texture
	kernelsPreview:any=null;	// preview textures
	resetTexture:number=0;		// tells the shader if reset (1) or filling with the gradient (2) is needed	
	paused:boolean=false;
	brush:Brush = new Brush;		//	[x, y, radius(in pixels), type]	
	convRadius:number=12;	//	the radius of kernel/convolution radius
}