db.products.updateOne({name:"IPhone 10",active:true}, {$set:{price:1200}})
db.products.updateMany({}, {$set:{active:true}})
db.products.deleteOne({name:"IPhone 10"})
db.products.deleteMany({category:"smartphone"})