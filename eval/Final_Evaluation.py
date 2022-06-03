from pymongo import MongoClient
client=MongoClient("mongodb+srv://snk:snk1210@cluster0.aoxct.mongodb.net/?retryWrites=true&w=majority")
dbs=client["Test"]
collection=dbs["testcollection"]
u=collection.find_one({})
print(u["Name"])