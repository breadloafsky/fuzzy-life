
export class Rule  {
	thresholds:number[] =  [0.4, 0.5, 0.5, 0.6];
	slopes:number[] =  [0.1,0.1,0.1,0.1];
}


export class Params{
	rules:Rule[] =[
		{
			thresholds: [0.0, 0.35, 0.2, 0.25],
			slopes:[0.05, 0.05, 0.05, 0.05],
		},
		{
			thresholds: [0.32, 1,0.271, 0.34],
			slopes:[0.05, 0.05, 0.05, 0.05],
		}
	];
    radius:number=12;	//	overall radius
	radiusRatio:number=1/3;	// ratio between inner and outer radius
}

export class Settings{
    paused:boolean=false;
	quality:number=2;
	debugVal:number=0;
}

export class Input{
    brush:number[]|any[] = [-1,0.5,16];	//x y r
}

