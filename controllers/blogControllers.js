const myBlogModel = require("../models/blogModel");
const cloudinary = require("cloudinary");
const { isEmpty } = require("../common/common");

//cloudinary
cloudinary.config({ 
    cloud_name: 'abhinav-nayak', 
    api_key: process.env.APIKEY, 
    api_secret: process.env.APISECRET, 
});

// Update blog
// app.put('/updateBlog', upload.single("blogImage"), (req,res)=> );

function updateBlog(req, res) {
    const blogImage=req.file;
    const body = req.body;
    const blogId= req.query;
    console.log(body);
    if(Object.hasOwn(blogId,"id")=== false && blogId.id.length===0) {
        return res.status(404).send({message: "You forgot to tell which blog to update."});
    }
    if(blogImage !== undefined){
        cloudinary.v2.uploader.upload_stream((error, result) => {
            if(error !== undefined){
                return res.status(500).send({message: "Server failed to update image."});
            
            }
            if(isEmpty(body)===true){
                myBlogModel.findByIdAndUpdate(blogId.id,{blogImage: result.url, ...body})
                .then(()=> {
                    return res.status(201).send({message:"Blog updated successfully"});
                })
                .catch(()=> {
                    return res.status(404).send({message:"Required Blog soes not found"});
                });
            }
            else{
                myBlogModel.findByIdAndUpdate(blogId.id, {blogImage: result.url})
                .then(()=> {
                    return res.status(201).send({message:"Blog updated successfully"});
                })
                .catch(()=> {
                    return res.status(404).send({message:"Required Blog soes not found"});
                });
            }
        })       
        .end(blogImage.buffer);
    }
    else{
        myBlogModel.findByIdAndUpdate(blogId.id,{...body})
        .then(()=> {
            return res.status(201).send({message:"Blog updated successfully"});
        })
        .catch(()=> {
            return res.status(404).send({message:"Required Blog soes not found"});
        });
    }
}

// Delete Blog
// app.delete('/deleteBlog', (req,res)=> );

function deleteBlog(req, res){
    const blogId= req.query;
    if(Object.hasOwn(blogId,"id") === false && blogId.id.length===0) {
        return res.status(404).send({message: "You forgot to tell which blog to delete."});
    }
    myBlogModel.findByIdAndDelete(blogId.id).then(()=>{
        return res.status(201).send({message:"Blog deleted successfully"});
    })
    .catch(()=>{
        return res.status(404).send({message:"Failed to delete Blog"});
    })
}

// New Blog
// app.post("/newBlog", upload.single("blogImage"), (req, res) => );


function newBlog(req, res) {
    const blogImage=req.file;
    const body = req.body;
    console.log(body);
    if(blogImage===undefined){
        return res.status(404).send({message: "You forgot to include image."});
    }
    cloudinary.v2.uploader.upload_stream((error, result) => {
    if(error !== undefined){
        return res.status(404).send({message: "Server failed to upload image."});
    }
    const newBlog = myBlogModel({
        blogImage: result.url,
        ...body,
    });
    newBlog.save()
        .then(()=> {
            return res.status(201).send({message: "Blog saved successfully."});
        })
        .catch(()=>{
            return res.status(500).send({message: "Server failed to save blog."});
        });
    })    
    .end(blogImage.buffer);
}

// get all blogs
// app.get("/getAllBlogs", (req,res)=> );

function getAllBlogs(req, res){
    myBlogModel.find()
    .then((data)=>{
        return res.status(200).send({message: "Blogs fetched Successfully", blogData: data});

    })
    .catch(()=>{
        return res.status(500).send({message:"Server send to failed blogs"});
    });
}

// fetch single blog
// app.get("/fetchSingleBlog", (req,res)=> );

function fetchSingleBlog(req, res){
    const blogId= req.query;
    if(Object.hasOwn(blogId,"id")=== false && blogId.id.length===0) {
        return res.status(404).send({message: "You forgot to tell which user's blog you want."});
    }
    myBlogModel.findById(blogId.id)
    .then((data)=>{
        console.log(data);
        return res.status(200).send({message: "Blogs fetched Successfully", blogData: data});

    })
    .catch(()=>{
        return res.status(500).send({message:"Server send to failed blogs"});
    });
}

// user specigfic blog
// app.get("/userSpecificBlogs", (req,res)=> );

function userSpecificBlogs(req, res){
    const userid= req.query;
    if(Object.hasOwn(userid,"id")=== false && userid.id.length===0) {
        return res.status(404).send({message: "You forgot to tell which user's blog you want."});
    }
    myBlogModel.find({userId: userid.id,
    })
    .then((data)=>{
        return res.status(201).send({message: "Blogs fetched Successfully", blogData: data});

    })
    .catch(()=>{
        return res.status(500).send({message:"Server send to failed blogs"});
    });
}


const obj ={
    newBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    fetchSingleBlog,
    userSpecificBlogs,
};

module.exports = obj;