const Router = require("express").Router;
const router = new Router();
const db = require("../data/connection");
const util = require("../util/helper");

const debug = require('debug')('app:ui');

// Renders the side panel page
router.get("/ui/panel", async (req, res) => {
    try {
        const queryParams = req.query;
        let name = await db.getName(queryParams.companyId);
        debug("Rendering the Custom UI Panel");
        res.render("panel", {name: name});    
    } catch (error) {
        return util.getErrorResponse("Could not render Custom UI panel", error, 500, res);
    }
});

// Renders the modal page
router.get("/ui/modal", async (req, res) => {
    try {
        const data = req.query;
        debug("Rendering the Custom UI Modal");
        res.render("modal", data);
    } catch (error) {
        return util.getErrorResponse("Could not render the Custom UI modal", error, 500, res);
    }
});

router.post('/ui/modal/new_deal', async function(req, res) { 
    var query = req.body

    try {
      var response = await util.createDeal(query);
      let id 
      res.render("success", {id: response.data.id});  
    }
    catch (error){
      res.send("Something went wrong");
    }
    
});


module.exports = router;