var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
    openid: String,
    mobilePhone: String,
    nickName: String,
    authorUrl: String,
    password: String,
    email: String,
    registeredIp: String,
    registeredZone: String,
    lastLoginIp: String,
}, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });
var record = new Schema({
    brief: String,
    image: [String],
  }, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });

var cyberFunder = new Schema({
    authorID: {type: Schema.Types.ObjectId, ref: 'User'},
    author: String,
    projectID: {type: Schema.Types.ObjectId, ref: 'Project'},
    projectName: String,
    count: { type: Number, default: 0 },
    price: { type: Number, default: 0 }
  }, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });
var projectSchema = new Schema({
    authorID: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    name: String,
    brief: String,
    price: { type: Number, default: 0 },
    image: String,
    detail: String,
});
var postSchema = new Schema({
    authorID: {type: Schema.Types.ObjectId, ref: 'User'},
    author: String,
    postType: String,
    petName:  String,
    petImage: [String],
    sex: Boolean, 
    sterilization: { type: Boolean, default:false},
    meta: {
        comments: { type: Number, default: 0 }, 
        cyberPets: { type: Number, default: 0 }, 
        views: { type: Number, default: 0 }, 
        votes: { type: Number, default: 0 }, 
        favs: { type: Number, default: 0 }
    }, 
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    tags: [String],
    vioce: [String],
    body:[String],
    records:[record],
    cyberFunders:[cyberFunder],
  }, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });

var reply = new Schema({
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String
}, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  })
var commentSchema = new Schema({
    parentId:{type: Schema.Types.ObjectId, ref:'Post'},
    from:{type: Schema.Types.ObjectId, ref:'User'},
    content: String,
    favs: [{ type: Schema.Types.ObjectId, ref:'User'}],
    reply:[reply],
}, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });

var plate = new Schema({
    plate_name: String,
    pages:[{
        notes:{head:String,name:String,tail:String,note:String},
        type: String,
        options:[Array],
    }]
});
var applyConfigSchema = new Schema({
    authorID: {type: Schema.Types.ObjectId, ref: 'User'},
    plates:[plate],
}, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });
var applicantSchema = new Schema({
    authorID: {type: Schema.Types.ObjectId, ref: 'User'},
    applyID:{type: Schema.Types.ObjectId, ref: 'ApplyConfig'},
    plates:[plate],
}, {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  });
exports.User = mongoose.model('User', userSchema);
exports.Post = mongoose.model('Post', postSchema);
exports.Comment = mongoose.model('Comment', commentSchema);
exports.Project = mongoose.model('Project', projectSchema);
exports.ApplyConfig = mongoose.model('ApplyConfig', applyConfigSchema);
exports.Applicant = mongoose.model('Applicant', applicantSchema);
 