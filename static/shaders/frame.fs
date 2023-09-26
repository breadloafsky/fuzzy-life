#define PI 3.1415926538
precision mediump float;

// inputs


varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uKern;

uniform int uKernelRadius;
uniform float uTextureDims[2];
uniform float uDebug;
uniform float uDelta;
uniform int uReset;
uniform float uRule[64];
uniform float uBrush[4];
uniform int isPaused;





highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
    coord.x = mod( coord.x	+ offsetX + 1.0, 1.0);
    coord.y = mod( coord.y	+ offsetY + 1.0, 1.0);
    return texture2D(uSampler, coord);
}


// sigmoid
float s0(float x,float a,float alpha) 
{ 
    return 1.0 / ( 1.0 + exp( -(x-a)*4.0/alpha ) );
}
// 2 sided sigmoid
float s1(float x,float a,float b,float alpha0, float alpha1)
{
    return s0(x,a,alpha0) 
        * ( 1.0-s0(x,b,alpha1) );
}
// transition function
float t(float m,float n, float o)
{
    float result = 0.0;
    for(int i = 0; i < 4; i++){
        float 
        a = s1( m, uRule[i*12+0], uRule[i*12+1], uRule[i*12+2], uRule[i*12+3]);
        a = min(a, s1( n, uRule[i*12+4], uRule[i*12+5], uRule[i*12+6], uRule[i*12+7]));
        a = min(a, s1( o, uRule[i*12+8], uRule[i*12+9], uRule[i*12+10], uRule[i*12+11]));
        result = max(result, a);   
    }
    return result;
}




float processPixel(){
 
    float r = float(uKernelRadius);
    
    // sum of convolution
    float k0 = 0.;
    float k1 = 0.;
    float k2 = 0.;

    // sum of weights
    float count_k0 = 0.;
    float count_k1 = 0.;
    float count_k2 = 0.;



    //  convolution
    for(float i = -31.; i < 32.; i++){
        for(float j = -31.; j < 32.; j++){
            
            float dist = distance(vec2(i,j), vec2(0.,0.));
            
            if( dist < r)
            {
                float i_f = (i) / uTextureDims[0];
                float j_f = (j) / uTextureDims[1];
                float pix = getPixel(vTextureCoord ,i_f, j_f ).r; 

                vec2 kernPos = vec2(i+r-0.5, j+r-0.5);
                
                vec4 k =  texture2D(uKern, kernPos / 64.);  // kernel texture
                k0 += pix*k.r;
                count_k0+=k.r;
                      
                k1 += pix*k.g;
                count_k1+=k.g;

                k2 += pix*k.b;
                count_k2+=k.b;
            }
        }
    }
    k0 = k0/count_k0;
    k1 = k1/count_k1;
    k2 = k2/count_k2;
    float result = t(k0, k1, k2);

    return result;

 
}

void main(void) {
    mediump vec4 tex = texture2D(uSampler, vTextureCoord);

    //process pixel value
    if(isPaused == 0){
        float d = processPixel(); 
        tex.g = tex.r;  // shift the previous value from red to green (needed for filtering)
        tex.r = clamp(tex.r + ((d*2.-1.) * uDelta), 0.0, 1.0);
    }
        
    //draw
    if(uBrush[3] > 1.){
        vec2 pos = vec2((vTextureCoord.x-uBrush[0])*uTextureDims[0],(vTextureCoord.y-uBrush[1])*uTextureDims[1]);
        if(distance(vec2(0.,0.),pos) < uBrush[2])
        {
            if(uBrush[3] == 2.)
                tex.rg = vec2(1);
            else if(uBrush[3] == 3.)
                tex.rg = vec2(0);
        }
    }
    // clear canvas / pattern fill
    if(uReset != 0)
    {
        if(uReset == 1)
            tex = vec4(0);
        else{
            //float x = (vTextureCoord.x-0.5)*2.5;
            float x = vTextureCoord.x;
            float y = vTextureCoord.y;
            tex = vec4(cos(x*sin(cos(y*2.*PI/4.)*8.*PI)*2.*PI)*0.5+0.5);
        }
        
    }
        
    


 


    gl_FragColor = tex;
}