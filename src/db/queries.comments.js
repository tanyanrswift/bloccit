const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;

const Authorizer = require("../policies/comment");

module.exports = {

 createComment(newComment, callback){
   return Comment.create(newComment)
   .then((comment) => {
     callback(null, comment);
   })
   .catch((err) => {
     callback(err);
   });
 },
 deleteComment(req, callback){
   //console.log("COMMENT ID:", req.params.id);
   return Comment.findById(req.params.id)
   .then((comment) => {
     //console.log("USER:", req.user);
     //console.log("COMMMENT:". comment);
     const authorized = new Authorizer(req.user, comment).destroy();
      //console.log("AUTHORIZED?", authorized);

     if(authorized){
       comment.destroy();
       callback(null, comment)
     } else {
       req.flash("notice", "You are not authorized to do that.")
       callback(401)
     }
   })
 }
}
