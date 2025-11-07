const express= require('express');
const path = require('path');
const app = express();
const fs= require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error reading files");
        }
        res.render("index", { files: files });
    });
}); 

app.get('/files/:filename', function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function(err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
}); 

app.get('/edit/:filename', function(req, res) {
   res.render('edit',{ filename: req.params.filename });
}); 

app.post('/edit', function(req, res) {
   fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err) {
    res.redirect('/');
   })
});  


app.post('/create', (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        if (err) {
            console.error(err);
            return res.status(500).send("Error creating file");
        }
        res.redirect('/');
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});