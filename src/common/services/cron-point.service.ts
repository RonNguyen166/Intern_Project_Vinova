// import cron from 'node-cron';
// import Users from "../models/user.model";
// import UserService from "../../modules/User/user.services";

<<<<<<< HEAD
// const userService = new UserService(Users);
// // const cronExec = cron.schedule('0 0 1 */1 *', () => {
=======
const userService = new UserService(Users);


export default class CronExec{
    constructor(){
        cron.schedule('0 0 1 * *',
        async ()=>{
            try{       
                const users = await userService.getAllUsers();
                for(let i = 0; i < users.length; i++){
                    if(users[i].point){
                        if(users[i].role === "member")
                        {   
                            users[i].point.givePoint += 50;
                        }
                        else if(users[i].role === "vice lead"){
                            users[i].point.givePoint += 100; 
                        }
                        else if(users[i].role === "leader"){
                            users[i].point.givePoint += 150;
                        }
                       userService.updateUser({_id: users[i]._id}, users[i]);
                    }
                }
                }
                catch(err){
                    console.log(err);
                    throw err;
                }
        }, {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh"
        })
    }
}
>>>>>>> dd76153c965026f4b0528f903604264e179cb90b

// export default class CronExec{
//     constructor(){
//         cron.schedule('* * * * *',
//         async ()=>{
//             //console.log("CRONNED 1");
//             try{
//                 const users = await userService.getAllUsers();
//                 for(let i = 0; i < users.length; i++){
//                     if(users[i].point){
//                         if(users[i].role === "member")
//                         {
//                             //console.log("i: " + i);
//                             //console.log(users[i].point.givePoint);
//                             users[i].point.givePoint += 50;
//                             //console.log(users[i].point.givePoint);
//                             //console.log("-------------------");
//                         }
//                         else if(users[i].role === "vice lead"){
//                             users[i].point.givePoint += 100;
//                         }
//                         else if(users[i].role === "leader"){
//                             users[i].point.givePoint += 150;
//                         }
//                        userService.updateUser({_id: users[i]._id}, users[i]);
//                     }
//                 }
//                 }
//                 catch(err){
//                     console.log(err);
//                     throw err;
//                 }
//         }, {
//             scheduled: true,
//             timezone: "Asia/Ho_Chi_Minh"
//         })
//     }
// }
