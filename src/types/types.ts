




export class Callbacks  {
	setKernel:any;
}

export class Rule  {
	thresholds:number[] =  [0.4, 0.5, 0.5, 0.6];
	slopes:number[] =  [0.001,0.001,0.001,0.001];
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
	kernImg:any=undefined
}


export class Params{
	rules:Rule[] =[
		{
			thresholds: [0.2, 0.35, 0.2, 0.25],
			slopes:[0.001, 0.001, 0.001, 0.001],
		},
		{
			thresholds: [0.32, 0.5,0.271, 0.34],
			slopes:[0.001, 0.001, 0.001, 0.001],
		}
	];
	kernels:Kernel[]=[
		{...new Kernel(), points:[
			{x:0.3,y:0.2},
			{x:0.7,y:0.6},
		]},
		{...new Kernel(), points:[
			{x:0.5,y:0.5},
		]}
	];
    kernelSize:number=12;	//	the radius of kernel/convolution radius
}


export class FormattedParams{
	thresholds:number[] = [0];
	slopes:number[] = [0];
	kernelTextures:any=[null,null,null,null,null,null];
}

export class Settings{
    paused:boolean=false;
	quality:number=2;
	debugVal:number=0;
}

export class Input{
    brush:number[]|any[] = [-1,0.5,16];		//	[x, y, radius(in pixels)]
}

