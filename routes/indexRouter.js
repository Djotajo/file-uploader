const { Router } = require("express");

const indexRouter = Router();

const db = require("../db/queries");

const upload = require("../middleware/upload");
const supabase = require("../middleware/supabase");

const formatFileSize = require("../middleware/size");

indexRouter.get("/", async (req, res) => {
  const root = await db.getRootFolder(req.user.id);
  res.render("index", {
    user: req.user,
    folder: root,
    format: formatFileSize,
  });
});

indexRouter.get("/:folderId/", async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await db.getFolderById(folderId);
    res.render("index", {
      user: req.user,
      folder: folder,
      format: formatFileSize,
    });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Internal Server Error");
  }
});

indexRouter.post("/:parentId/add-folder", async (req, res) => {
  try {
    const { title, parentId } = req.body;
    await db.postNewFolder(title, req.user.id, parentId);
    const folder = await db.getFolderById(parentId);
    res.render("index", {
      user: req.user,
      folder: folder,
      format: formatFileSize,
    });
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).send("Internal Server Error");
  }
});

indexRouter.post(
  "/:parentId/upload",
  upload.single("file"),
  async function (req, res, next) {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const fileName = `${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("file-uploader")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.status(500).send("Failed to upload to Supabase");
    }

    const fileUrl = `https://wowijotfrwfnvnjpvvre.supabase.co/storage/v1/object/public/file-uploader/${fileName}`;
    // res.send({ fileUrl });

    const { parentId } = req.body;
    console.log(req.file);
    await db.postNewFile(
      fileName,
      fileUrl,
      req.user.id,
      parentId,
      req.file.size
    );
    const folder = await db.getFolderById(parentId);

    res.redirect(`/${parentId}/`);
    // res.redirect("index", {
    //   user: req.user,
    //   folder: folder,
    //   format: formatFileSize,
    // });
  }
);

indexRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = indexRouter;
