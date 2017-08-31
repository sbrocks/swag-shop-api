var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

var db=mongoose.connect('mongodb://localhost/swag-shop');


var Product=require('./model/product');
var WishList=require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product',function(req,res){
	var product= new Product();
	product.title=req.body.title;
	product.price=req.body.price;
	product.save(function(err,savedProduct){
		if(err){
			res.status(500).send({error:"Could not save product"});
		} else{
			res.send(savedProduct);
		}
	});
});

app.get('/product',function(req,res){
	Product.find({},function(err,products){
		if(err){
			res.status(500).send({error:"Could not fetch products"});
		} else{
			res.send(products);
		}
	});
});

app.get('/wishlist',function(req,res){
	WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err,wishLists){
		if(err){
			res.status(500).send({error:"Could not fetch wishlists"});
		} else{
			res.send(wishLists);
		}
	})
});


app.post('/wishlist',function(req,res){
	var wishList=new WishList();
	wishList.title=req.body.title;
	wishList.save(function(err,newWishList){
		if(err){
			res.status(500).send({error:"Could not create wishlists"});
		} else{
			res.send(newWishList);
		}
	});
});


app.put('/wishlist/product/add',function(req,res){
	Product.findOne({_id:req.body.productId},function(err,product){
		if(err){
			res.status(500).send({error:"Could not add item to wishlist"});
		} else{
			WishList.update({_id:req.body.wishListId},{$addToSet:{products:product._id}},
				function(err,wishList){
				if(err){
					res.status(500).send({error:"Could not add item to wishlist"});
				} else{
					res.send(wishList);
				}
				
			});
		}
	});
});

app.listen(3000,function(){
	console.log('Swag Shop Api running at port 3000');
});



