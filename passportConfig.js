const LocalStrategy=require("passport-local").Strategy;
const {client}=require("./database").client;
const bcrypt=require("bcrypt");
function initialize(passport){
    const autheticateUser=(username,password,done)=>{

        client.query(
        'SELECT *FROM users WHERE username=$1',[username],(err,result)=>{
           if(err){
            throw err;
           }
           console.log(result.rows);
           if(result.rows.length>0){
            const user=result.rows[0];
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){
                    throw err;
                }
                if(isMatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:"password is invalid"});
                }
            });
           }else{
            return done(null,false,{message:"account is not registered"});
           }


        }
     );
 };
     passport.use(

       new LocalStrategy(
         
        {
            usernameField:"username",
            passwordField:"password"
        },
        autheticateUser
       )
       );
       passport.serializeUser((user,done)=>done(null,user.id));
       passport.deserializeUser((id,done)=>{
        client.query(
            'SELECT*FROM users WHERE uid=$1',[id],(err,result)=>{
               if(err){
                throw err;
               }
               return done(null,result.rows[0]);
            });
       });

}

module.exports=initialize;