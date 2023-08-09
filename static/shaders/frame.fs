#define PI 3.1415926538
precision mediump float;

// inputs

uniform mediump float inputs[8];
uniform mediump float uTextureDims[2];

varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;


highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
}

float processPixel(highp vec2 tex){
 



  const int r = 10;
  
  mediump float inner = 0.;
  mediump float outer = 0.;

  int count_inner = 0;
  int count_outer = 0;


  for(int i = -r+1; i < r; i++){
    for(int j = -r+1; j < r; j++){

      mediump float i_f = float(i) / uTextureDims[0];
      mediump float j_f = float(j) / uTextureDims[1];
      
      mediump float dist = distance(vec2(i_f * uTextureDims[0], j_f * uTextureDims[1]), vec2(0.,0.)); 	

      if( dist <  float(r)*0.33)
      {
        inner += getPixel(vTextureCoord ,i_f, j_f ).r;
        count_inner++;
      }
      else if( dist < float(r)){
        outer += getPixel(vTextureCoord ,i_f, j_f ).r;
        count_outer++;
      }
    }
  }

    inner = inner/float(count_inner);
    outer = outer/float(count_outer);

    highp float result = -0.2;
    
    if (
      ( inner > inputs[0] && inner < inputs[1]  && outer > inputs[2] &&  outer < inputs[3]  )  || 
      ( inner > inputs[4]  && inner < inputs[5] && outer > inputs[6]  && outer < inputs[7]  ) 
      ) 
          result *= -1.;


  return result;

 
}

void main(void) {
  mediump vec4 tex = texture2D(uSampler, vTextureCoord);
  tex.r = tex.r + processPixel(vTextureCoord);  
  gl_FragColor = tex;
}