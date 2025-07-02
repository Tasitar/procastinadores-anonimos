import {User} from "../model/usuarios.models.js";

export const createuser = async(req, res) =>{
    const {name, password, gmail} = req.body;
    if (name===""){
        return res.status(401).json({message: "no se permiten campos vacios"})
    };
    if (password===""){
        return res.status(401).json({message: "no se permiten campos  vacios"})
    };
    if (gmail===""){
        return res.status(401).json({message: "no se permite campos vacios"})
    };

    try{
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch(err){
        res.status(500).json({error: err.message});
    };
}

export const getAllusers =async (req, res) =>{
    try{
        const user = await User.findAll();
        res.json(user);
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

export const getusersbyId = async(req, res)=>{
    try{
        const user = await User.findByPk (req.param.id);
        if (user) res.json(user);
        else res.status(404).json({message: "usuario no encontrado"});
    } catch(err){
        res.status(500).json({error: err.message});
    }
}

export const updateusers = async(req, res) =>{
    try{
        const [update] = await User.update(req, body,{
            where: {id:req, param,id }
        });
    if(update) {
        const updateusers = await User.findByPk (req.param.id);
        res.json (updateusers);
    } else{
        res.status(404).json({message: "usuario no contrado"});
    }
} catch (err){
    res.status(500).json ({error: err.message});
        }
};

export const deleteuser = async(req, res) =>{
    try{
        const deleted = await User.destroy({where: {id: req.param.id}});
        if (deleted) res.json({message: "usuario eliminado"})
            else res.status(404),json({message: "usuario no encontrado "}) 
    }catch(err){
    res.status(500).json ({error: err.message}); 
    }
};