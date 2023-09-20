
export class SubRule{
	thersholds:number[] = [0.3, 0.5];
	slopes:number[] = [0.001, 0.001];
	enabled:boolean = true; 
}
export class Rule  {
	subRules:SubRule[] = [
		new SubRule(),
		new SubRule(),
		new SubRule(),
	];
	enabled:boolean = true;
}

export class Kernel  {
	points:number[][]=[
			[0.5, 0.5],
	];
	enabled:boolean = true;
}

export class Params{
	kernels:Kernel[]=[
		new Kernel(),
		new Kernel(),
		{...new Kernel(), enabled:false},
	];
	rules:Rule[] = [
		new Rule(),
		{...new Rule(), enabled:false},
		{...new Rule(), enabled:false},
		{...new Rule(), enabled:false},
	];
    convRadius:number=12;	//	the radius of kernel/convolution radius
	dt:number = 0.5;		// dt multiplier
}




