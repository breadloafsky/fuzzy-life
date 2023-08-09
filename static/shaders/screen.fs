precision mediump float;

uniform mediump float uTextureDims[2];
uniform sampler2D uSampler;
varying lowp vec2 vTextureCoord;


highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
}

void main(void) {
  mediump vec4 tex = texture2D(uSampler, vTextureCoord);

  
  tex = vec4(0,0,0,1);
  for(int i = -1; i < 1; i++){
    for(int j = -1; j < 1; j++){
      mediump float i_f = float(i) / uTextureDims[0];
      mediump float j_f = float(j) / uTextureDims[1];
      tex.r += getPixel(vTextureCoord ,i_f, j_f ).r;
    }
  }
  tex.r /= 4.;
  
  tex = vec4(tex.r,tex.r,tex.r,1.);
  if(tex.r > 0.8)
    tex.rb *= vec2(0.6,0.8);
  else if(tex.r > 0.3)
    tex.gr *= vec2(1.,2.);
  else
    tex.br *= vec2(2.,1.);
  

  
  gl_FragColor = tex;
}