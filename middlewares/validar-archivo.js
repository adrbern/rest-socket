const validarArchivoSubir = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({
              msg:  'No files were uploaded.'
          });
      }
  
      if (!req.files.archivo) {
          return res.status(400).send({
              msg:  'No files were uploaded.'
          });
      }

      next();
}

module.exports = {
    validarArchivoSubir
}