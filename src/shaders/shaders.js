
export const shaders = {

  
	basicVs:`
  

  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`,



basicFs:`


#define PI 3.1415926538
precision highp float;

// inputs
uniform highp float inp0;
uniform highp float inp1;

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


  const int r = 10;
  
  highp float inner = 0.;
  highp float outer = 0.;

  int count_inner = 0;
  int count_outer = 0;


  for(int i = -r+1; i < r; i++){
    for(int j = -r+1; j < r; j++){
    
 
      
      mediump float i_f = float(i) * mtpl;
      mediump float j_f = float(j) * mtpl;

      
      mediump float dist = distance(vec2(i_f, j_f), vec2(0.,0.)); 	

        if( dist <  float(r)*mtpl/3.)
        {
          inner += getPixel(vTextureCoord ,i_f, j_f ).r;
          count_inner++;
        }
        else if( dist < float(r)*mtpl){
          outer += getPixel(vTextureCoord ,i_f, j_f ).r;
          count_outer++;
        }
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
    if(tex.r > 0.9)
      tex.bg /=2.;
    else
      tex.gb *= 2.;
  }

  // if( sqrt(pow(vTextureCoord.x-0.5,2.) + pow(vTextureCoord.y-0.5,2.)) < 0.1)
  //   tex.r = 0.0;

    

  


  
  gl_FragColor = tex;
}



`,


}


