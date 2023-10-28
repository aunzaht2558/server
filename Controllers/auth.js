const User = require("../Models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

const { getIPClient } = require("../Functions/Notify");

const tokenLine = "xnHjgf4frHfjyiLc3k3tUY2FNO66ilgIoBMyV2TWZno";
exports.register = async (req, res) => {
  try {
    //code
    // 1.CheckUser
    const { firstname, lastname, email, password } = req.body;
    
	if(!(firstname && lastname && email && password)){
	     res.status(400).send("User Already Exists!!!");
	}
	else{
	
	var user = await User.findOne({ email });
    if (user) {
       res.status(400).send("User Already Exists!!!");
    }
	else {
    // 2.Encrypt
		const salt = await bcrypt.genSalt(10);
		user = new User({
		  firstname,
		  lastname,
		  email,
		  password,
		});
		user.password = await bcrypt.hash(password, salt);
		// 3.Save
		await user.save();
		res.status(201).send("Register Success!!");
    }
   }
  } catch (err) {
    //code
    console.log(err);
    res.status(500).send("Server Error");
  }
};
exports.login = async (req, res) => {
  try {
    //code
    // 1. Check User
    const ip = await getIPClient(req);
    // console.log(ip);

    const { email, password } = req.body;
    var user = await User.findOneAndUpdate({ email }, { ip: ip }, { new: true });
    console.log(user);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send("Password Invalid!!!");
      }
      // 2. Payload
      var payload = {
        user: {
          email: user.email,
          role: user.role,
        },
      };
      // notify
      const text = "User " + user.email + " Login ที่  Ipaddress :" + ip;
     

      // 3. Generate
      jwt.sign(payload, "ljwtsecret", { expiresIn: "1d" }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      const text = "User " + email + " พยายาม Login ที่ Ipaddress :" + ip;
      
      return res.status(400).send("User not found!!!");
    }
  } catch (err) {
    //code
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.loginLine = async (req, res) => {
  try {
    //code
    const { userId, displayName, pictureUrl } = req.body;
    var data = {
      name: userId,
      displayName: displayName,
      picture: pictureUrl,
    };
    // 1 Check
    var user = await User.findOneAndUpdate({ name: userId }, { new: true });
    if (user) {
      console.log("User Updated!!!");
    } else {
      user = new User(data);
      await user.save();
    }
    // 2. Payload
    var payload = {
      user,
    };
    // console.log(payload)
    // 3. Generate
    jwt.sign(payload, "jwtsecret", { expiresIn: "1d" }, (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    });
  } catch (err) {
    //code
    console.log(err);
    res.status(500).send("Server Error");
  }
};


exports.currentUser = async (req, res) => {
  try {
    //code
    console.log("currentUser", req.user);
    const user = await User.findOne({ email: req.user.email })
      .select("-password")
      .exec();

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
