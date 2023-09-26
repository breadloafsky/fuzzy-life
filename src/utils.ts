import type KernelCanvas from "./components/misc/KernelCanvas.svelte";
import type { Kernel, Params } from "./types/params";
import type { TempParams } from "./types/tempParams";

export const utils = {
	// calculate Catmull–Rom spline value
	// x : radius
	getKernelValue: function(kernel:Kernel,x:number):number{
		let px:number[] = [];
		let py:number[] = [];
		const pts = kernel.points;
		let id = 0;
		for(let i = 0; i < pts.length+1; i++){
			if(i < pts.length && x < pts[i][0]){
				id = i;
				break;
			}
			else if(i >= pts.length){
				id = pts.length;
				break;
			}
		}
		for(let i = -2; i < 2; i++){
			if(i + id < 0)
			{
				px.push(-0.1);
				py.push(pts[0][1]);
			}
			else if(i + id > pts.length-1){
				px.push(1.1);
				py.push(pts[pts.length-1][1]);
			}
			else{
				px.push(pts[i+id][0]);
				py.push(pts[i+id][1]);
			}
			
		}
		const t = (x-px[1])/(px[2]-px[1]);
		const y = 0.5 *((2 * py[1]) 
			+(-py[0] + py[2]) * t 
			+(2*py[0] - 5*py[1] + 4*py[2] - py[3]) * t**2 
			+(-py[0] + 3*py[1]- 3*py[2] + py[3]) * t**3);
		
		return Math.round((y)*1000)/1000;
	},

	// get kernel's pixel offset positions and distance from center
	getKernelPoints: function(r:number):any{
		let pts:number[] = [];
		let dists:number[] = [];
		let count = 0;
		for(let i = -r+1.; i < r; i++){
			for(let j = -r+1.; j < r; j++){
				let dist = Math.sqrt(i**2+j**2);
				if(dist < r)
				{
					pts.push(i);
					pts.push(j);
					dists.push(dist);
					count++;
				}
				
			}
		}
		return [pts, dists, count];
	},
	// format rules into 1d array
	formatRules: function(params:Params, tempParams:TempParams){
		tempParams.rules = [];
		for(let i = 0; i < params.rules.length; i++)
		{
			let s:number[] = [];
			if(params.rules[i].enabled && Math.max(...params.rules[i].conditions.map((r,j) => r.enabled && params.kernels[j].enabled as any)))
			{
				for(let j = 0; j < params.kernels.length; j++){
					if(params.kernels[j].enabled && params.rules[i].conditions[j].enabled)
					{
						s = s.concat(params.rules[i].conditions[j].thersholds)
						s = s.concat(params.rules[i].conditions[j].slopes)
					}	
					else
						s = s.concat(-0.5,1.5,0.1,0.1);
				}
			}
			else
				s = [0,0,0,0, 0,0,0,0, 0,0,0,0];
			tempParams.rules = tempParams.rules.concat(s);
		}
	},
	// regenerate kernel textures
	updateKernels: function(params:Params, tempParams:TempParams, kc:KernelCanvas):any{
		tempParams.kernelTexture = kc.renderTexture(params.kernels, params.convRadius);
		tempParams.kernelsPreview = kc.renderPreview(params.kernels, params.convRadius);
	},
};
