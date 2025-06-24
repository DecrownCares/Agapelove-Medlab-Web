
const Users = require('../models/User');
const Post = require('../models/Post');
const Editor = require('../models/Editor');
const bcrypt = require('bcryptjs');



const createEditor = async(req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({"message": "All fields are required"})
    }
    const duplicate = await Editor.findOne({username: username}).exec();
    if (duplicate) {
        return res.sendStatus(409) //Conflict
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await Editor.create( {
            "username":username,
            "email":email,
            "password": hashedPassword
        });
        console.log(result);

        res.status(201).json({"success": `New user ${username} created!`})
        
    }catch (err) {
        res.status(500).json({"message": err.message})
    }
  }

const getAllEditors = async (req, res) => {
    const editors = await Users.find({'roles.Editor' : {$exists:true}}).exec();
    if(!editors) return res.status(400).json({"message" : "No Editor found"});
    console.log(editors)
    res.status(200).json(editors)
}

const getEditor = async (req, res) => {
    if(!req.params?.id) return res.status(400).json({"message" : " Student ID is required"});

    const editor = await Users.findOne({_id:req.params?.id}).exec();

    if(!editor){

        return res.status(400).json({'message':`Student with id ${req.params.id} not found`})
    }

    res.status(200).json(editor)
}

module.exports = {
    createEditor,
    getAllEditors,
    getEditor
}