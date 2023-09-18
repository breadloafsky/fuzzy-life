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
uniform float uRules[64];

// uniform int uNumberOfKernels;
// uniform int uNumberOfRules;

uniform int isPaused;
uniform float brush[4];




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
float t(float m,float n, float o)
{
    float result = 0.0;
    for(int i = 0; i < 4; i++){

        // if(i < uNumberOfRules)
        // {
            float 
            a = s1( m, uRules[i*12+0], uRules[i*12+1], uRules[i*12+2], uRules[i*12+3]);
            a = min(a, s1( n, uRules[i*12+4], uRules[i*12+5], uRules[i*12+6], uRules[i*12+7]));
            a = min(a, s1( o, uRules[i*12+8], uRules[i*12+9], uRules[i*12+10], uRules[i*12+11]));
            result = max(result, a);
        //}
        
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




    for(float i = -15.; i < 16.; i++){
        for(float j = -15.; j < 16.; j++){
            
            float dist = distance(vec2(i,j), vec2(0.,0.));
            if( dist < r)
            {
                float i_f = (i) / uTextureDims[0];
                float j_f = (j) / uTextureDims[1];
                float pix = getPixel(vTextureCoord ,i_f, j_f ).r; 

                vec2 kernPos = vec2(i+r-0.5, j+r-0.5);
                
                vec4 k =  texture2D(uKern, kernPos / 64.);
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
        tex.g = tex.r;
        tex.r = clamp(tex.r + ((d*2.-1.) * uDelta), 0.0, 1.0);
    }
    
    //draw
    if(brush[3] != 0.){
        vec2 pos = vec2((vTextureCoord.x-brush[0])*uTextureDims[0],(vTextureCoord.y-brush[1])*uTextureDims[1]);
        if(distance(vec2(0.,0.),pos) < brush[2])
        {
            if(brush[3] == 1.)
                tex.rg = vec2(1.0);
                //tex.rg = vec2(sin(atan(pos.x,pos.y)*9.)*0.4+0.6);
            else if(brush[3] == 2.)
                tex.rg = vec2(0);
        }
    }
    if(uReset != 0)
    {
        if(uReset == 1)
        {
            tex = vec4(0);
        }
        else{
            float x = vTextureCoord.x;
            float y = vTextureCoord.y;
            tex = vec4(cos(x*sin(cos(y*2.*PI/4.)*8.*PI)*2.*PI)*0.5+0.5);
        }
        
    }
        
    


 


    gl_FragColor = tex;
}