
#define PI 3.1415926538
precision highp float;



uniform highp float inputs[8];


varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform int uProcessVal;  // switch the shader behaviour




highp vec4 getPixel(highp vec2 coord, highp float offsetX,highp float offsetY){

  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
}

highp float processPixel(highp vec2 tex){
 
  // e.g.:  0.007 is the 1/128px
  const highp float mtpl = 1./512.;


  const mediump float radius = 12.0;
  
  highp float inner = 0.;
  highp float outer = 0.;

  int count_inner = 0;
  int count_outer = 0;


    const int maxIter = 100;

    for(int i = 0; i < maxIter; i++)
    {
      mediump float i_f = float(i);
      mediump float r = sqrt(i_f/float(maxIter));
      
      mediump float px = cos(i_f*14.)*radius;
      mediump float py = sin(i_f*14.)*radius;

      if( r <  0.4)
      {
        inner += getPixel(vTextureCoord ,px, py ).r;
        count_inner++;
      }
      else if( r <  1.0)
      {
        outer += getPixel(vTextureCoord ,px, py ).r;
        count_outer++;
      }
    }

    inner = inner/float(count_inner);
    outer = outer/float(count_outer);

    highp float result = -0.18;
    
    if (
      ( inner < inputs[0] && inner > inputs[1]  && outer < inputs[2] &&  outer > inputs[3]  )  || 
      ( inner < inputs[4]  && inner > inputs[5] && outer < inputs[6]  && outer > inputs[7]  ) 
      ) 
          result *= -1.;

  return result;

 
}

void main(void) {


  highp vec4 tex = texture2D(uSampler, vTextureCoord);
  

  if(float(uProcessVal) > 0.)
  {
    tex.r = tex.r + processPixel(vTextureCoord);
    //tex.r = 0.0;
  }
  else{
    tex = vec4(tex.r,tex.r,tex.r,1.0); 
    if(tex.r > 0.5)
      tex.r /=2.; 
    else
      tex.rb *= 2.;
  }

  // if( sqrt(pow(vTextureCoord.x-0.5,2.) + pow(vTextureCoord.y-0.5,2.)) < 0.1)
  //   tex.r = 0.0;

    

  


  
  gl_FragColor = tex;
}
