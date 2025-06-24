
const Reader = require('../models/Reader')
const bcrypt = require('bcryptjs');



const getAllReaders = async (req, res) => {
    const readers = await Reader.find();
    if (!readers) return res.status(204).json({ 'message': 'No students found' });
    res.json(readers);
}

const createReader = async (req, res) => {
    const { username, email, password } = req.body;
    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }

    // Check for duplicate email
    try {
        const duplicate = await Reader.findOne({ email: email }).exec();
        if (duplicate) {
            return res.sendStatus(409); // Conflict
        }

        // Create a new reader
        const hashedPassword = await bcrypt.hash(password, 10);
        const newReader = await Reader.create({
            username,
            email,
            password: hashedPassword
        });

        // Respond with the newly created student
        res.status(201).json({'message': `${username}'s successfully created`});

    } catch (err) {
        console.error('Error creating student:', err); // Optional: Log the error
        res.status(500).json({ "message": err.message });
    }
};

const updateReader = async (req, res) => {
    if(!req.body.id){
     return res.status(400).json({"message": "ID parameter is required"})
    }
    const reader = await Reader.findOne({_id: req.body.id}).exec();
    if(!reader){
     return res.status(400).json({"message": "Reader not found"})
    }
    try {
         if(req.body?.username) reader.username = req.body.username;
         if(req.body?.email) reader.email = req.body.email;
         if(req.body?.country) reader.country = req.body.country;
         if(req.body?.password) reader.password = req.body.password;
         const result = await reader.save();
         res.status(200).json(result, {"message": 'reader edited successfully'});
     }catch (err) {
         res.status(500).json({"message": err.message})
     }

}
const deleteReader = async(req, res) => {
    if(!req.params.id){
        return res.status(400).json({"message": "ID parameter is required"})
    }
    const reader = await Reader.findOne({_id: req.params.id}).exec();//.findOne({_id: req.body.id});
    if(!reader){
        return res.status(400).json({"message": "Student not found"})
    }
    const result = await reader.deleteOne();
    res.status(200).json(result, {"message": 'Reader deleted successfully'});
  
}
const getReader = async(req, res) => {
    if(!req?.params?.id) return res.status(400).json({"message": "Blog ID required"});

    const reader = await Reader.findOne({_id: req.params.id}).exec();
    if (!reader) {
        return res.status(400).json({ "message": `Blog ID ${id} not found` });
    }
    res.json(reader);
}

module.exports = {
    getAllReaders,
    createReader,
    updateReader,
    deleteReader,
    getReader
}