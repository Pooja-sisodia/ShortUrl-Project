const shortid = require("shortid");
const validator = require("validator");
const urlModel = require("../models/urlModel");



//----------------------------------------------------------------------------------------
//                                1. API -  POST/url/shorten
//----------------------------------------------------------------------------------------

const createUrl = async function (req, res) {
  try {
    const body = req.body;

    if (Object.keys(body).length === 0)return res.status(400).send({ status: false, message: "Invalid Request Body: Body Empty." });
    
    let { longUrl } = body;

    if (typeof longUrl === "undefined" || longUrl === null ||
        (typeof longUrl === "string" && longUrl.length === 0)
    ) return res.status(400).send({ status: false, message: "Please enter a valid <longUrl>." });
    
    if (!validator.isURL(longUrl)) return res.status(400).send({ status: false, message: "<longURL> NOT a Valid URL Format." });
      
      const urlCode = shortid.generate().toLowerCase();
      const baseUrl = "http://localhost:3000";
      const shortUrl = baseUrl + "/" + urlCode;

      const data = { longUrl, shortUrl, urlCode };

      const createData = await urlModel.create(data);

      const result = {
        urlCode: createData.urlCode,
        longUrl: createData.longUrl,
        shortUrl: createData.shortUrl,
      };

      return res.status(201).send({ status: true, message: "Successfully Generated Short URL.",data: result,});
    
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//----------------------------------------------------------------------------------------
//                                2. API -  GET/:urlCode
//----------------------------------------------------------------------------------------

const getUrlByParams = async function (req, res) {
  try {
    let requestParams = req.params.urlCode;

      let findUrlCode = await urlModel
        .findOne({ urlCode: requestParams })
        .select({ urlCode: 1, longUrl: 1, shortUrl: 1, _id: 0 });

      if (!findUrlCode) return res.status(404).send({status: false, message: `<urlCode>: <${requestParams}> NOT Found.`,});
    
      return res.status(302).redirect( findUrlCode.longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrlByParams };