
export class Condition{
	thersholds:number[] = [];
	slopes:number[] = [];
}
export class Rule  {
	conditions:Condition[] = [];
	enabled:boolean=false;
}

export class Kernel  {
	points:number[][]=[];
}

export class Params{
	kernels:Kernel[]=[];
	rules:Rule[] = [];
    convRadius:number=12;	//	the radius of kernel/convolution radius
	dt:number = 0.5;		// dt multiplier
}




