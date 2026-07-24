const uploadImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No image uploaded."
            });

        }

        res.status(200).json({
            success: true,
            message: "Image Uploaded Successfully",
            file: req.file.filename
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Upload Failed"
        });

    }

};

module.exports = {
    uploadImage
};