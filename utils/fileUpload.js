const multer = require("multer");

const File_Type = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValidFormat = File_Type[file.mimetype];
    let uploadError = new Error("format image is not valid");

    if (isValidFormat) {
      uploadError = null;
    }

    cb(uploadError, "public/images");
  },
  filename: (req, file, cb) => {
    const extention = File_Type[file.mimetype];
    const uniqueName = `${file.fieldname}-${Date.now()}.${extention}`;
    // console.log(file);

    cb(null, uniqueName);
  },
});

exports.uploadFile = multer({ storage: storageFile });

// postData: async (req, res) => {
//   // try {
//   const { title, description, github, url } = req.body;
//   const fileSmall = req.files.imageSmall[0];
//   const fileBig = req.files.imageBig[0];
//   console.log(fileSmall);

//   if (!req.files["imageSmall"] && !req.files["imageBig"]) {
//     return res
//       .status(400)
//       .json({ status: "400: Bad Request", message: "Image is required!" });
//   }

//   const newPathSmall = `${req.protocol}://${req.get("host")}/public/images/${
//     fileSmall.filename
//   }`;
//   const newPathBig = `${req.protocol}://${req.get("host")}/public/images/${
//     fileBig.filename
//   }`;

//   const data = await Portfolio.create(
//     {
//       title,
//       description,
//       links: {
//         github,
//         url,
//       },
//       images: {
//         imageSmall: newPathSmall,
//         imageBig: newPathBig,
//       },
//       // categories: {
//       //   categoryId: category,
//       // },
//       // stacks: {
//       //   techstackId: stack,
//       // },
//     },
//     {
//       include: [
//         { model: Link, as: "links" },
//         { model: Image, as: "images" },
//         // { model: Category, as: "categories" },
//         // { model: Techstack, as: "stacks" },
//       ],
//     }
//   );

//   return res.status(201).json({
//     status: "201: Created",
//     message: "Data created!",
//     data,
//   });
//   // } catch (err) {
//   //   return res.status(400).json({
//   //     status: "400: Bad Request",
//   //     message: err,
//   //   });

//   //   // console.log(err);
//   // }
// },

// getAllPortfolio: async (req, res) => {
//   try {
//     const data = await Portfolio.findAll({
//       include: [
//         {
//           model: Link,
//           as: "links",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "portfolioId"],
//           },
//         },
//         {
//           model: Image,
//           as: "images",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "portfolioId"],
//           },
//         },
//         {
//           model: Category,
//           as: "categories",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "categoryId"],
//           },
//         },
//         {
//           model: Techstack,
//           as: "stacks",
//           attributes: {
//             exclude: ["createdAt", "updatedAt", "techstackId"],
//           },
//         },
//       ],
//     });
//     return res.status(200).json({
//       status: "200: Ok",
//       message: "Success",
//       data,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "400: Bad Request",
//       message: error,
//     });
//   }
// },

// getDetail: async (req, res) => {
//   const { id } = req.params;

//   const data = await Portfolio.findByPk(id, {
//     include: [
//       {
//         model: Link,
//         as: "links",
//         attributes: {
//           exclude: ["createdAt", "updatedAt", "portfolioId"],
//         },
//       },
//       {
//         model: Image,
//         as: "images",
//         attributes: {
//           exclude: ["createdAt", "updatedAt", "portfolioId"],
//         },
//       },
//     ],
//   });

//   if (!data) {
//     return res.status(404).json({
//       status: "404: Not Found",
//       message: "Data doesn't exists",
//     });
//   }

//   return res.status(200).json({
//     status: "200: Ok",
//     message: "Success",
//     data,
//   });
// },

// deleteData: async (req, res) => {
//   const { id } = req.params;

//   const data = await Portfolio.findByPk(id, {
//     include: [
//       {
//         model: Link,
//         as: "links",
//         attributes: {
//           exclude: ["createdAt", "updatedAt", "portfolioId"],
//         },
//       },
//       {
//         model: Image,
//         as: "images",
//         attributes: {
//           exclude: ["createdAt", "updatedAt", "portfolioId"],
//         },
//       },
//     ],
//   });

//   if (data) {
//     const replaceSmall = data.images.imageSmall.replace(
//       `${req.protocol}://${req.get("host")}/public/images/`,
//       ""
//     );
//     const pathSmall = `./public/images/${replaceSmall}`;
//     fs.unlink(pathSmall, (err) => {
//       if (err) {
//         new Error("Data not found");
//       }
//     });
//     const replaceBig = data.images.imageBig.replace(
//       `${req.protocol}://${req.get("host")}/public/images/`,
//       ""
//     );
//     const pathBig = `./public/images/${replaceBig}`;
//     fs.unlink(pathBig, (err) => {
//       if (err) {
//         new Error("Data not found");
//       }
//     });

//     await data.destroy();

//     return res.status(200).json({
//       status: "200: Ok",
//       message: "Success",
//     });
//   } else {
//     return res.status(404).json({
//       status: "404: Not Found",
//       message: "Data doesn't exists",
//     });
//   }
// },
