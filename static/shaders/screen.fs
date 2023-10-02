#define PI 3.1415926538
precision mediump float;
varying lowp vec2 vTextureCoord;
uniform mediump float uTextureDims[2];
uniform sampler2D uSampler;
uniform int uGradient;
uniform int uPostProcessing[2];
uniform float uBrush[4];



vec4 getColor0(float v){
  vec3 a = vec3(
    cos(v*2.*PI),
    cos(v*2.*PI+2.*PI/3.),
    cos(v*2.*PI-2.*PI/3.)
  );
  a += 0.5;
  a = clamp(a,vec3(0,0,0),vec3(1,1,1));
  a.rgb *= clamp((v*1.5),0.,1.);
  return vec4(a,1);
}

vec4 getColor1(float v){
  v = clamp((v*1.2),0.,1.);
  return vec4(vec3(v),1.);
}



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
  // chose colouring method
  if(uGradient == 0)
    tex = getColor0(tex.r);
  else
    tex = getColor1(tex.r);

  // display brush
  if(uBrush[3] != 0.){
        vec2 pos = vec2((vTextureCoord.x-uBrush[0])*uTextureDims[0],(vTextureCoord.y-uBrush[1])*uTextureDims[1]);
        float d = distance(vec2(0.,0.),pos-0.5);
        if(d > uBrush[2]-0.5 && d < uBrush[2]+0.5)
        {
            tex.rgb = vec3(1);
        }
    }
  
  gl_FragColor = tex;
}