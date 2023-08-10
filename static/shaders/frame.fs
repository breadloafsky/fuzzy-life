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

float s1(float x,float a,float alpha) 
{ 
    return 1.0 / ( 1.0 + exp( -(x-a)*4.0/alpha ) );
}
float s2(float x,float a,float b,float alpha)
{
    return s1(x,a,alpha) 
        * ( 1.0-s1(x,b,alpha) );
}

float t(float m,float n)
{
    float a = min(s2( m, inputs[0], inputs[1], 0.04) , s2( n, inputs[2], inputs[3], 0.04));
    float b = min(s2( m, inputs[4], inputs[5], 0.04) , s2( n, inputs[6], inputs[7], 0.04));

    return max(a,b);
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

      if( dist <  float(r)/3.)
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
    result = t(inner,outer);
    
    // if (
    //   ( inner > inputs[0] && inner < inputs[1]  && outer > inputs[2] &&  outer < inputs[3]  )  || 
    //   ( inner > inputs[4]  && inner < inputs[5] && outer > inputs[6]  && outer < inputs[7]  ) 
    //   ) 
    //       result *= -1.;


  return result;

 
}

void main(void) {
  mediump vec4 tex = texture2D(uSampler, vTextureCoord);
  float d = processPixel(vTextureCoord)*2.-1.; 

  tex.r = clamp(tex.r + (d * 0.2), 0.0, 1.0);

  gl_FragColor = tex;
}