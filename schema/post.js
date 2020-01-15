var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  authorID: 0,
  author: String,
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  },
   
  author: "重庆小动物协会", 
  post_type: "claim", 
  name: "托比", 
  imags: [
      "/image/dog1.png"
  ], 
  sex: true, 
  sterilization: false, 
  meta: {
      comments: 0, 
      cyberPets: 0, 
      views: 0, 
      votes: 0, 
      favs: 0
  }, 
  comments: [ ], 
  tags: [
      "斗牛犬", 
      "棕色", 
      "中型", 
      "和猫融洽", 
      "少年", 
      "亲近小孩", 
      "与老人相处不错"
  ], 
  vioce: [ ], 
  history: [
      "甜蜜可爱的可卡犬喜欢与家人分开。", 
      "Toby是一只6岁的家训男性可卡犬，非常友好，喜欢人，其他狗，甚至是猫。他喜欢和他的狗玩具一起玩，然后去散步。他喜欢和他的人在一起，探索!", 
      "托比需要和另一只活跃的狗在一起。他是一个非常活跃的人，渴望与其他狗和人交往。他不是那种每天可以独自待在家里8小时的狗。如果你喜欢散步，还有另一条需要朋友的狗，并想要一条将成为你生活中不可或缺的一部分的狗，那么托比就是你的家伙。", 
      "托比有部分视力，但没有任何麻烦自己到处走走。此外，托比可以听到，但由于过去未经治疗的耳部感染的疏忽，他有一些听力问题。 ", 
      "如果您想与Toby见面，请与我们联系，以确保他将在我们的星期六收养。 由于我们需要对我们的狗进行家庭检查，我们不会在南加州地区以外采用，也不会将狗运到该国其他地区或国外，所以请不要问。"
  ]
});

exports.Post=mongoose.model('Post', postSchema);