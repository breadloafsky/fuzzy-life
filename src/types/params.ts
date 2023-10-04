
export class Condition{
	thersholds:number[] = [];
	slopes:number[] = [];
}
export class Rule  {
	conditions:Condition[] = [];
	enabled:boolean=false;
}

export class Kernel {
	points:number[][]=[];
}

export class Params{
	kernels:Kernel[]=[];
	rules:Rule[] = [];
    convRadius:number=12;	//	the radius of kernel/convolution radius
	dt:number = 0.5;		// dt multiplier
}

export class Brush {
	x:number=0.5;	// pos x
	y:number=0.5;	// pos y
	r:number=16;	// radius in pixels
	type:number=0;	// type 0:hidden, 1: display brush, 2: draw, 3: erase
}



