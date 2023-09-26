
export class SubCondition{
	thersholds:number[] = [0.3, 0.5];
	slopes:number[] = [0.001, 0.001];
	enabled:boolean = true; 
}
export class Condition  {
	subConditions:SubCondition[] = [
		new SubCondition(),
		new SubCondition(),
		new SubCondition(),
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
	conditions:Condition[] = [
		new Condition(),
		{...new Condition(), enabled:false},
		{...new Condition(), enabled:false},
		{...new Condition(), enabled:false},
	];
    convRadius:number=12;	//	the radius of kernel/convolution radius
	dt:number = 0.5;		// dt multiplier
}




