#define PI 3.1415926538
precision mediump float;
varying lowp vec2 vTextureCoord;
uniform mediump float uTextureDims[2];
uniform sampler2D uSampler;
uniform sampler2D uGradient;
uniform int uPostProcessing[2];
uniform float uBrush[4];


highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
	coord.x += offsetX;
	coord.y += offsetY;
	return texture2D(uSampler, coord);
}

void main(void) {

	float blur = float(uPostProcessing[0]); // anti-aliasing blur value
	float frameSmooth = float(uPostProcessing[1]);

	mediump vec4 tex = vec4(0,0,0,0);

	// simple anti-aliasing blur
	for(int i = 0; i < 4; i++){
		for(int j = 0; j < 4; j++){
			float i_f = float(i);
			float j_f = float(j);
			if(blur > i_f && blur > j_f){
				i_f = (i_f-blur/2.) / uTextureDims[0];
				j_f = (j_f-blur/2.) / uTextureDims[1];
				tex += getPixel(vTextureCoord ,i_f, j_f );
			} 
		}
	}
	tex.rgba /= blur*blur;

	tex.r = (tex.r+tex.g*frameSmooth)/(1.+frameSmooth); // filter the high frequency blinking
	//tex.r = max(tex.r,tex.b);

	// get colour from the gradient
	float c = (tex.r*64.*64.);
	tex = texture2D(uGradient, vec2(mod(c,64.)/64.,floor(c/64.)/64.));

	// display brush
	if(uBrush[3] != 0.){
		vec2 pos = vec2((vTextureCoord.x-uBrush[0])*uTextureDims[0],(vTextureCoord.y-uBrush[1])*uTextureDims[1]);
		float d = distance(vec2(0.,0.),pos-0.5);
		if(d > uBrush[2]-0.5 && d < uBrush[2]+0.5)
			tex.rgb = 1.-tex.rgb;
		
	}
	gl_FragColor = tex;
}