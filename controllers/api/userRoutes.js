const router = require('express').Router();
const { User, Customers,Employees,TimeEntries,Jobs } = require('../../models');

    //find all users from user table
    //include associated information either employees or customers
router.get('/', async (req,res)=>{
    try{
        await User.findAll({
            include:[
            {
                model:Customers,
            },
            {
                model:Employees,
            }
            ]
        }).then ((data) => res.status(202).json(data))
    } catch (err){
        res.status(500).json(err);
    }
});

router.get('/:userID',async (req,res)=>{
    //find a single user by their userID
    //include associated data from customers or Employees
    try{
        await User.findByPk(req.params.userID, {
            include:[
                {
                    model: Customers,
                },
                {
                    model: Employees,
                }
            ]
        }).then((data)=> res.status(200).json(data))
    } catch (err){
        res.status(500).json(err);
    }
});

//delete user by userID
router.delete('/:userID', (req,res)=>{
    try {
        User.destroy({
            where: {
                userID:req.params.userID
            }
        }).then(data=> res.status(200).json(data));
    } catch(err){
        res.status(500).json(err);
    }
});

//create new user
router.post('/',(req,res)=>{
            //req.body should look like this
        // {
        //     "username":"peterJ",
        //     "password":"testpassword3",
        //     "employee":true
        // }
    try {
        const newUser = req.body;
        if(newUser){
            User.create(newUser)
            .then((data) => res.status(202).json(data));
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

//destroy user by their userID
router.delete('/:userID',(req,res)=>{
    try{
        User.destroy({
            where:{
                userID:req.params.userID,
            }
        }).then((data)=>{
            res.status(200).json(data);
        })
    }catch(err){
        res.status(500).json(err);
    }
});

//update user by their userID
router.put('/:userID', (req,res)=> {
    try{
        User.update({
            userName: req.body.username,
        },
        {
            where:{
                userID:req.params.userID
            }
        }).then ((data)=>{
            res.status(200).json(data);
        })
    } catch(err){
        res.status(500).json(err);
    }
});


router.post('/login', (req, res) => {
    User.findOne({
      where: {
        userID: req.body.userID,
      },
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(400).json({ message: "No user with that username!" });
          return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
  
        if (!validPassword) {
          res.status(400).json({ message: "Incorrect password!" });
          return;
        }
        req.session.save(() => {
          req.session.userID = dbUserData.userID;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
  
          res.json({ user: dbUserData, message: "You are now logged in!" });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;