export class Params{
    sigmoids:number[] =[
		0.0, 0.35, 0.2, 0.25,	//A  
		0.32, 1,0.271, 0.335,	//B
		0.0, 0.0, 0.0, 0.0,		//C  
		0.0, 0.0, 0.0, 0.0,		//D
	];// the values of sigmoid
	slopes:number[] =[
		0.01, 0.01, 0.01, 0.01,	 
		0.01, 0.01, 0.01, 0.01,	
		0.01, 0.01, 0.01, 0.01,		 
		0.01, 0.01, 0.01, 0.01
	];	// slopes of sigmoid
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

