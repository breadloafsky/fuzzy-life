




export class Callbacks  {
	updateKernelGraphs:any;
	updateKernelTexture:any;
	updateRules:any;
}



export class Point  {
	x:number=0;
	y:number=0;
}

export class Kernel  {
	points:Point[]=[
		{
			x:0.5,
			y:0.5
		},
	];
	rules:number[][]=[
			[0.3, 0.5, 0.001, 0.001],
	];
	kernImg:any=undefined;
}


export class Params{
	kernels:Kernel[]=[
		{
			...new Kernel(), 
			points:[
			{x:0.3,y:0.2},
			{x:0.7,y:0.6},
			],
			rules:[
				[0.3,0.5, 0.001, 0.001]
			],

		},
		{
			...new Kernel(), 
	
		}
	];
    convRadius:number=12;	//	the radius of kernel/convolution radius
	numberOfRules:number = 1;
	dt:number = 0.5;		// dt multiplier
}


export class FormattedParams{
	rules:number[] = [0];
	kernelTextures:any=[null,null,null,null,null,null];
	kernelTexture:any=null;
	nKernels:number = 1;
	nRules:number = 1;
	convRadius:number = 12;
}

export class Settings{
    paused:boolean=false;
	quality:number=2;
	debugVal:number=0;
}

export class Input{
    brush:number[]|any[] = [-1,0.5,16];		//	[x, y, radius(in pixels)]
}

